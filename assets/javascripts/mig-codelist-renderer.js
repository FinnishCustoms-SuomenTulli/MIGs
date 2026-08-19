(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var localized = global.MIGUtils.localized;
    var loadJson = global.MIGUtils.loadJson;
    var createElement = global.MIGUtils.el;
    var isActiveOnDate = global.MIGUtils.isActiveOnDate;
    var markdownToHtml = global.MIGUtils.markdownToHtml;
    var externalizeLinks = global.MIGUtils.externalizeLinks;
    var formatDisplayDate = global.MIGUtils.formatDisplayDate
    var normalizeIsoDate = global.MIGUtils.normalizeIsoDate;

    function numericCssValue(value) {
        var number = parseFloat(value);

        return isNaN(number) ? 0 : number;
    }

    function outerHeight(element) {
        if (!element || element.hidden) {
            return 0;
        }

        var style = global.getComputedStyle(element);

        return element.getBoundingClientRect().height + numericCssValue(style.marginTop) + numericCssValue(style.marginBottom);
    }

    function nextFrame(callback) {
        if (typeof global.requestAnimationFrame === 'function') {
            global.requestAnimationFrame(callback);
            return;
        }

        global.setTimeout(callback, 0);
    }

    function formatValidity(item, lang) {
        var startDate = formatDisplayDate(item.startDate, lang);
        var endDate = formatDisplayDate(item.endDate, lang);

        if (startDate && endDate) {
            return startDate + ' - ' + endDate;
        }

        return startDate || endDate || '';
    }

    function filterLabel(filterName) {
        return String(filterName || '').replace(/^Filter_/, '');
    }

    function collectUsedFilterKeys(items) {
        var used = Object.create(null);

        (items || []).forEach(function (item) {
            var filters = item && item.filters ? item.filters : {};

            Object.keys(filters).forEach(function (filterName) {
                if (filterName.indexOf('Filter_') === 0) {
                    used[filterName] = true;
                }
            });
        });

        return used;
    }

    function buildFilterColumns(data, items, lang) {
        var used = collectUsedFilterKeys(items);
        var definitions = data && Array.isArray(data.Definitions) ? data.Definitions : [];
        var columns = [];

        definitions.forEach(function (definition) {
            if (!definition || !used[definition.Name]) {
                return;
            }

            columns.push({
                key: definition.Name,
                label: filterLabel(definition.Name),
                help: localized(definition.Definition, lang, filterLabel(definition.Name)
                )
            });

            delete used[definition.Name];
        });

        Object.keys(used)
            .sort()
            .forEach(function (filterName) {
                columns.push({ key: filterName, label: filterLabel(filterName), help: filterLabel(filterName) });
            });

        return columns;
    }

    function appendTextCell(row, value, className) {
        var cell = createElement('td', className, value == null ? '' : value);

        row.appendChild(cell);

        return cell;
    }

    function appendRowHeader(row, value, className) {
        var cell = createElement('th', className, value == null ? '' : value);
        cell.setAttribute('scope', 'row');

        row.appendChild(cell);

        return cell;
    }

    function filterIsEnabled(value) {
        return value === 1 || value === '1' || value === true;
    }

    function appendFilterCell(row, item, filterKey) {
        var filterClass = filterLabel(filterKey).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
        var cell = createElement('td', 'code-list-filter code-list-filter-' + filterClass);
        var filters = item && item.filters ? item.filters : {};
        var enabled = filterIsEnabled(filters[filterKey]);

        if (enabled) {
            var icon = createElement('span', 'icon icon-tulli-checkmark');

            icon.setAttribute('aria-hidden', 'true');
            cell.appendChild(icon);
        }

        cell.appendChild(createElement('span', 'sr-only', enabled ? t('codeLists.filterEnabled') : t('codeLists.filterDisabled')));

        row.appendChild(cell);

        return cell;
    }

    function createCodeItemRow(item, filterColumns, lang) {
        var row = document.createElement('tr');

        appendRowHeader(row, item.code, 'code-list-code');

        appendTextCell(row, item.name, 'code-list-name');

        filterColumns.forEach(function (filterColumn) {
            appendFilterCell(row, item, filterColumn.key);
        });

        appendTextCell(row, formatValidity(item, lang), 'code-list-validity');

        return row;
    }

    function createPaginationArrow(symbol, label, className) {
        var button = createElement('button', 'btn btn-default btn-sm code-list-pagination-button ' + (className || ''));

        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', label);
        button.appendChild(document.createTextNode(symbol));
        button.appendChild(createElement('span', 'sr-only', label));

        return button;
    }

    function visiblePageRange(pageIndex, pageCount, visibleCount) {
        var half = Math.floor(visibleCount / 2);
        var start = Math.max(0, pageIndex - half);
        var end = Math.min(pageCount, start + visibleCount);

        start = Math.max(0, end - visibleCount);

        return {
            start: start,
            end: end
        };
    }

    function findCodeList(data, codeListId) {
        var codeLists = data && Array.isArray(data.CodeLists) ? data.CodeLists : [];

        return codeLists.find(function (codeList) {
            return codeList && codeList.Identification === codeListId;
        }) || null;
    }

    function normalizeCodeItem(item, lang) {
        item = item || {};

        return {
            code: item.Code || '',
            name: localized(item.Name, lang, ''),
            description: localized(item.Description, lang, ''),
            startDate: item.StartDate || '',
            endDate: item.EndDate || '',
            filters: item.Filters && typeof item.Filters === 'object' ? Object.assign({}, item.Filters) : {},
            source: item
        };
    }

    function normalizeCodeList(codeList, lang) {
        if (!codeList) return null;

        return {
            id: codeList.Identification || '',
            name: localized(codeList.Name, lang, codeList.Identification || ''),
            description: localized(codeList.Description, lang, ''),
            items: Array.isArray(codeList.CodeItems)
                ? codeList.CodeItems.map(function (item) {
                    return normalizeCodeItem(item, lang);
                })
                : [],
            source: codeList
        };
    }

    function findCodeItem(codeList, code, selectedDate) {
        if (!codeList || !Array.isArray(codeList.items)) {
            return null;
        }

        code = String(code || '');

        return codeList.items.find(function (item) {
            return String(item.code) === code && isActiveOnDate(item, selectedDate);
        }) || null;
    }

    function renderCodeItem(data, target, options) {
        options = options || {};

        var codeListId = options.codeListId || options.id || '';
        var code = options.code !== undefined && options.code !== null ? String(options.code) : '';
        var lang = options.lang || 'en';

        if (!codeListId || !code) {
            return null;
        }

        var selectedDate = normalizeIsoDate(options.date);
        var sourceCodeList = findCodeList(data, codeListId);
        var codeList = normalizeCodeList(sourceCodeList, lang);

        // Missing code list: deliberately return nothing. Do not clear or modify the target.
        if (!codeList) {
            return null;
        }

        var item = findCodeItem(codeList, code, selectedDate);

        // Missing or inactive code: deliberately return nothing.
        if (!item) {
            return null;
        }

        // Prefer an explicit item description when one exists. CL401 stores its explanatory text in Name.
        var text = item.description || item.name || '';

        if (!text) {
            return null;
        }

        if (target) {
            var block = createElement('div', options.className || 'code-list-item-description');

            block.setAttribute('data-code-list-id', codeList.id);
            block.setAttribute('data-code', item.code);

            block.textContent = text;

            // Append instead of replacing existing content. This allows the CL401 text to follow the constraints.json content.
            target.appendChild(block);
        }

        return {
            codeList: codeList,
            item: item,
            text: text,
            selectedDate: selectedDate
        };
    }

    function loadCodeList(url, target, options) {
        options = options || {};

        return loadJson(url).then(function (data) {
            return renderCodeList(data, target, options);
        });
    }

    function loadCodeItem(url, target, options) {
        options = options || {};

        return loadJson(url)
            .then(function (data) {
                return renderCodeItem(data, target, options);
            })
            .catch(function (error) {
                // This API is used for optional supplementary content. With silent:true, even a loading or parsing error is deliberately ignored.
                if (options.silent === true) {
                    return null;
                }

                throw error;
            });
    }

    function renderCodeListTable(codeList, target, options) {
        options = options || {};

        var lang = options.lang || 'en';
        var selectedDate = normalizeIsoDate(options.date);
        var fitToModal = options.fitToModal === true;

        var requestedPageSize = Math.max(
            1,
            Number(options.pageSize) || 100
        );

        // When modal fitting is enabled, initially render only ten rows. Once Bootstrap has shown the modal, the renderer can measure the real available height and adjust the page size.
        var pageSize = fitToModal ? Math.min(requestedPageSize, 10) : requestedPageSize;
        var pageIndex = 0;
        var restoreNumberButtonFocus = false;

        var items = codeList.items.filter(function (item) {
            return isActiveOnDate(item, selectedDate);
        });

        if (typeof options.itemFilter === 'function') {
            items = items.filter(function (item) {
                return options.itemFilter(item, codeList);
            });
        }

        var filterColumns = buildFilterColumns(options.data, codeList.items, lang);

        if (codeList.description) {
            var description = createElement('div', 'code-list-description');
            var descriptionHtml = markdownToHtml(codeList.description);

            if (descriptionHtml) {
                description.innerHTML = descriptionHtml;
            } else {
                description.textContent = codeList.description;
            }

            externalizeLinks(description);

            target.appendChild(description);
        }

        var wrapper = createElement('div', 'table-responsive code-list-table-wrapper');
        var table = createElement('table', 'table table-striped table-hover table-condensed code-list-table');
        var caption = createElement('caption', 'sr-only', codeList.id + (codeList.name && codeList.name !== codeList.id ? ' - ' + codeList.name : ''));

        table.appendChild(caption);

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        var codeHeader = createElement('th', '', t('codeLists.tableHeaders.code'));

        codeHeader.setAttribute('scope', 'col');
        headerRow.appendChild(codeHeader);

        var nameHeader = createElement('th', '', t('codeLists.tableHeaders.name'));

        nameHeader.setAttribute('scope', 'col');
        headerRow.appendChild(nameHeader);

        filterColumns.forEach(function (filterColumn) {
            var th = createElement('th', 'code-list-filter-header');

            th.setAttribute('scope', 'col');
            th.appendChild(document.createTextNode(filterColumn.label));

            var helpButton = createElement('button', 'code-list-filter-help');

            helpButton.setAttribute('type', 'button');
            helpButton.setAttribute('title', filterColumn.help);
            helpButton.setAttribute('aria-label', filterColumn.label + ': ' + filterColumn.help);
            helpButton.setAttribute('data-toggle', 'tooltip');
            helpButton.setAttribute('data-placement', 'top');
            helpButton.appendChild(createElement('span', 'icon icon-tulli-info'));
            helpButton.lastChild.setAttribute('aria-hidden', 'true');

            th.appendChild(helpButton);

            headerRow.appendChild(th);
        });

        var validityHeader = createElement('th', '', t('codeLists.tableHeaders.validity'));

        validityHeader.setAttribute('scope', 'col');
        headerRow.appendChild(validityHeader);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        table.appendChild(tbody);
        wrapper.appendChild(table);
        target.appendChild(wrapper);

        var pagination = createElement('nav', 'code-list-pagination');

        pagination.setAttribute('aria-label', t('codeLists.pagination.label'));

        var paginationControls = createElement('div', 'code-list-pagination-controls');
        var firstButton = createPaginationArrow('\u00AB', t('codeLists.pagination.first'), 'code-list-pagination-first');
        var previousButton = createPaginationArrow('<', t('codeLists.pagination.previous'), 'code-list-pagination-previous');
        var numberButtons = createElement('span', 'code-list-pagination-numbers');
        var nextButton = createPaginationArrow('>', t('codeLists.pagination.next'), 'code-list-pagination-next');
        var lastButton = createPaginationArrow('\u00BB', t('codeLists.pagination.last'), 'code-list-pagination-last');
        var pageStatus = createElement('span', 'code-list-pagination-status');

        pageStatus.setAttribute('aria-live', 'polite');
        pageStatus.setAttribute('aria-atomic', 'true');

        paginationControls.appendChild(firstButton);
        paginationControls.appendChild(previousButton);
        paginationControls.appendChild(numberButtons);
        paginationControls.appendChild(nextButton);
        paginationControls.appendChild(lastButton);

        pagination.appendChild(paginationControls);
        pagination.appendChild(pageStatus);

        target.appendChild(pagination);

        function pageCount() {
            return Math.max(
                1,
                Math.ceil(items.length / pageSize)
            );
        }

        function clearTableBody() {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
        }

        function setPage(nextPageIndex) {
            var count = pageCount();

            pageIndex = Math.max(
                0,
                Math.min(nextPageIndex, count - 1)
            );

            renderPage();
        }

        function renderNumberButtons() {
            numberButtons.innerHTML = '';

            var count = pageCount();
            var range = visiblePageRange(pageIndex, count, 5);
            var currentPageButton = null;

            for (
                var pageNumber = range.start;
                pageNumber < range.end;
                pageNumber += 1
            ) {
                (function (targetPage) {
                    var visiblePageNumber = targetPage + 1;

                    var button = createElement('button', 'btn btn-default btn-sm ' + 'code-list-pagination-number', visiblePageNumber);

                    button.setAttribute('type', 'button');
                    button.setAttribute('aria-label', t('codeLists.pagination.page') + ' ' + visiblePageNumber);

                    if (targetPage === pageIndex) {
                        button.classList.add('active');
                        button.setAttribute('aria-current', 'page');
                        button.appendChild(createElement('span', 'sr-only', ' (' + t('codeLists.pagination.current') + ')'));

                        currentPageButton = button;
                    }

                    button.addEventListener(
                        'click',
                        function () {
                            restoreNumberButtonFocus =
                                true;

                            setPage(targetPage);
                        }
                    );

                    numberButtons.appendChild(button);
                })(pageNumber);
            }

            if (restoreNumberButtonFocus) {
                restoreNumberButtonFocus = false;

                if (currentPageButton) {
                    currentPageButton.focus();
                }
            }
        }

        function renderEmptyState() {
            var emptyRow = document.createElement('tr');
            var emptyCell = createElement('td', 'code-list-empty', t('codeLists.noItemsForDate'));

            emptyCell.setAttribute('colspan', String(3 + filterColumns.length));

            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);

            pagination.hidden = true;
            pageStatus.textContent = '';
        }

        function renderPage() {
            clearTableBody();

            if (!items.length) {
                renderEmptyState();
                return;
            }

            var count = pageCount();

            if (pageIndex >= count) {
                pageIndex = count - 1;
            }

            var startIndex = pageIndex * pageSize;
            var endIndex = Math.min(startIndex + pageSize, items.length);
            var fragment = document.createDocumentFragment();

            for (
                var index = startIndex;
                index < endIndex;
                index += 1
            ) {
                fragment.appendChild(createCodeItemRow(
                    items[index],
                    filterColumns,
                    lang
                ));
            }

            tbody.appendChild(fragment);

            firstButton.disabled = pageIndex === 0;
            previousButton.disabled = pageIndex === 0;
            nextButton.disabled = pageIndex >= count - 1;
            lastButton.disabled = pageIndex >= count - 1;

            renderNumberButtons();

            pageStatus.textContent = (startIndex + 1) + '\u2013' + endIndex + ' / ' + items.length;

            pagination.hidden = items.length <= pageSize;
        }

        // These listeners are attached once. The earlier incomplete implementation attached some of them every time a page was rendered, which caused duplicate events.
        firstButton.addEventListener('click', function () {
            setPage(0);
        });

        previousButton.addEventListener('click', function () {
            setPage(pageIndex - 1);
        });

        nextButton.addEventListener('click', function () {
            setPage(pageIndex + 1);
        });

        lastButton.addEventListener('click', function () {
            setPage(pageCount() - 1);
        });

        function modalIsVisible(modal) {
            if (!modal) return false;

            return (
                modal.classList.contains('in') ||
                modal.classList.contains('show')
            ) &&
                modal.getBoundingClientRect().height > 0;
        }

        function refreshPageSizeFromModal() {
            if (!fitToModal || !items.length) return;

            var modal = target.closest('.modal');
            var dialog = target.closest('.modal-dialog');
            var content = target.closest('.modal-content');
            var modalBody = target.closest('.modal-body');

            if (!modal || !dialog || !content || !modalBody || !modalIsVisible(modal)) {
                return;
            }

            var renderedRows = tbody.querySelectorAll('tr');
            var sampleRowHeight = 0;

            // Use the tallest of the first ten visible rows. This is safer than assuming every row has the same height.
            for (
                var index = 0;
                index < Math.min(renderedRows.length, 10);
                index += 1
            ) {
                sampleRowHeight = Math.max(
                    sampleRowHeight,
                    renderedRows[index]
                        .getBoundingClientRect()
                        .height
                );
            }

            if (!sampleRowHeight) return;

            var dialogStyle = global.getComputedStyle(dialog);
            var bodyStyle = global.getComputedStyle(modalBody);
            var tableStyle = global.getComputedStyle(table);
            var modalHeader = content.querySelector('.modal-header');
            var modalFooter = content.querySelector('.modal-footer');
            var description = target.querySelector('.code-list-description');
            var maximumContentHeight = global.innerHeight - numericCssValue(dialogStyle.marginTop) - numericCssValue(dialogStyle.marginBottom);
            var fixedHeight = outerHeight(modalHeader) + outerHeight(modalFooter) + numericCssValue(bodyStyle.paddingTop) + numericCssValue(bodyStyle.paddingBottom) + outerHeight(description) + outerHeight(pagination) + thead.getBoundingClientRect().height + numericCssValue(tableStyle.marginTop) + numericCssValue(tableStyle.marginBottom) + 12;
            var availableRowsHeight = maximumContentHeight - fixedHeight;

            var calculatedPageSize = Math.max(
                1,
                Math.floor(
                    availableRowsHeight / sampleRowHeight
                )
            );

            if (calculatedPageSize === pageSize) {
                return;
            }

            // Preserve the first item that was visible before the page size changed.
            var firstVisibleItem = pageIndex * pageSize;

            pageSize = calculatedPageSize;

            pageIndex = Math.floor(firstVisibleItem / pageSize);

            renderPage();
        }

        function scheduleModalFit(attempt) {
            attempt = attempt || 0;

            var modal = target.closest('.modal');

            // The JSON may finish rendering before Bootstrap has completed showing the modal. Retry briefly until real dimensions exist.
            if (!modalIsVisible(modal)) {
                if (attempt < 20) {
                    global.setTimeout(function () {
                        scheduleModalFit(attempt + 1);
                    }, 50);
                }

                return;
            }

            nextFrame(function () {
                refreshPageSizeFromModal();

                // Measure once more after the first page-size change has caused the modal and table to relayout.
                global.setTimeout(function () {
                    refreshPageSizeFromModal();
                }, 50);
            });
        }

        function handleResize() {
            scheduleModalFit();
        }

        renderPage();

        codeList.selectedDate = selectedDate;
        codeList.visibleItems = items;
        codeList.refreshPagination = scheduleModalFit;

        if (fitToModal) {
            var modal = target.closest('.modal');

            if (modal) {
                global.addEventListener('resize', handleResize);

                if (global.jQuery && global.jQuery.fn) {
                    var $modal = global.jQuery(modal);

                    $modal.one(
                        'shown.bs.modal.migCodeList',
                        function () {
                            scheduleModalFit();
                        }
                    );

                    $modal.one(
                        'hidden.bs.modal.migCodeList',
                        function () {
                            global.removeEventListener('resize', handleResize);
                        }
                    );

                    // Also start immediately. If the modal is not visible yet, scheduleModalFit() retries until Bootstrap has shown it.
                    scheduleModalFit();
                } else if (
                    modal.classList.contains('in')
                ) {
                    scheduleModalFit();
                }
            }
        }

        return codeList;
    }

    function renderCodeList(data, target, options) {
        options = options || {};

        if (!target) return null;

        target.innerHTML = '';

        var codeListId = options.codeListId || options.id || '';
        var lang = options.lang || 'en';
        var sourceCodeList = findCodeList(data, codeListId);
        var codeList = normalizeCodeList(sourceCodeList, lang);

        if (!codeList) {
            target.textContent = t('codeLists.notFound') + ' ' + codeListId;

            return null;
        }

        renderCodeListTable(codeList, target, {
            data: data,
            lang: lang,
            date: options.date,
            pageSize: options.pageSize,
            fitToModal: options.fitToModal,
            itemFilter: options.itemFilter
        });

        if (global.MIGIntro && typeof global.MIGIntro.refreshTooltips === 'function') {
            global.MIGIntro.refreshTooltips(target);
        }

        return codeList;
    }

    global.MIGCodeListRenderer = {
        loadCodeList: loadCodeList,
        renderCodeList: renderCodeList,
        loadCodeItem: loadCodeItem,
        renderCodeItem: renderCodeItem
    };
})(window);