(function (global) {
    'use strict';

    var state = null;

    var t = global.MIGUtils.t;
    var createElement = global.MIGUtils.el;
    var localized = global.MIGUtils.localizedCoerce;
    var todayIso = global.MIGUtils.todayIso;
    var twoDigits = global.MIGUtils.twoDigits;
    var isActiveOnDate = global.MIGUtils.isActiveOnDate;
    var loadJson = global.MIGUtils.loadJson;
    var safeId = global.MIGUtils.safeId;
    var localeForLanguage = global.MIGUtils.localeForLanguage;
    var formatDisplayDate = global.MIGUtils.formatDisplayDate;
    var normalizeIsoDate = global.MIGUtils.normalizeIsoDate;
    var renderErrorAlert = global.MIGUtils.renderErrorAlert;

    function lowerCase(value) {
        return String(value || '')
            .toLocaleLowerCase(
                localeForLanguage(state.lang)
            );
    }

    function appendGeneratedTimestamp(data) {
        var generated =
            data &&
            (data.Generated || data.generated);

        if (!generated) {
            return;
        }

        var navbar =
            document.querySelector('.main-navbar');

        if (
            !navbar ||
            navbar.dataset.codeListsGenerated === 'true'
        ) {
            return;
        }

        var generatedDate = new Date(generated);

        if (isNaN(generatedDate.getTime())) {
            return;
        }

        var localDate = [
            generatedDate.getFullYear(),
            twoDigits(generatedDate.getMonth() + 1),
            twoDigits(generatedDate.getDate())
        ].join('-');

        var generatedTime =
            twoDigits(generatedDate.getHours()) +
            '.' +
            twoDigits(generatedDate.getMinutes());

        var headerText = [
            t('pageTitles.codes'),
            formatDisplayDate(localDate, state.lang),
            generatedTime
        ].join(' ');

        var oldHeader =
            navbar.querySelector('.mig-header-info');

        if (oldHeader) {
            oldHeader.remove();
        }

        navbar.appendChild(
            createElement(
                'span',
                'mig-header-info',
                ' ' + headerText
            )
        );

        navbar.dataset.codeListsGenerated = 'true';
    }

    function datePickerFormat(lang) {
        return lang === 'en'
            ? 'D/M/YYYY'
            : 'D.M.YYYY';
    }

    function codeListSearchText(codeList, selectedDate) {
        codeList = codeList || {};

        var parts = [
            codeList.Identification || '',
            localized(
                codeList.Name,
                state.lang,
                ''
            ),
            localized(
                codeList.Description,
                state.lang,
                ''
            )
        ];

        var items = Array.isArray(codeList.CodeItems)
            ? codeList.CodeItems
            : [];

        items.forEach(function (item) {
            if (!isActiveOnDate(item, selectedDate)) {
                return;
            }

            parts.push(item.Code || '');

            parts.push(localized(
                item.Name,
                state.lang,
                ''
            ));

            parts.push(localized(
                item.Description,
                state.lang,
                ''
            ));
        });

        return lowerCase(parts.join('\n'));
    }

    function buildSearchIndex() {
        state.searchIndex = Object.create(null);

        state.codeLists.forEach(function (codeList) {
            var codeListId = codeList.Identification || '';

            if (!codeListId) {
                return;
            }

            state.searchIndex[codeListId] =
                codeListSearchText(codeList, state.selectedDate);
        });
    }

    function codeItemMatchesSearch(item, searchTerm) {
        if (!searchTerm) {
            return true;
        }

        var searchableText = [
            item.code,
            item.name,
            item.description
        return lowerCase(searchableText)
            .indexOf(searchTerm) !== -1;
    }

    function currentSearchTerm() {
        if (!state.searchInput) {
            return '';
        }

        return lowerCase(
            state.searchInput.value
        ).trim();
    }

    function highlightRowsInContent(content, searchTerm) {
        if (!content) {
            return;
        }

        var rows = content.querySelectorAll('.code-list-table tbody tr');

        Array.prototype.forEach.call(
            rows,
            function (row) {
                /*
                 * Ignore informational rows such as the
                 * "no items" message.
                 */
                if (row.querySelector('.code-list-empty')
                ) {
                    row.classList.remove('codes-search-match');

                    return;
                }

                var matches = searchTerm && lowerCase(row.textContent).indexOf(searchTerm) !== -1;

                row.classList.toggle('codes-search-match', Boolean(matches));
            }
        );
    }

    function highlightRenderedRows(searchTerm) {
        Object.keys(state.rows).forEach(
            function (codeListId) {
                highlightRowsInContent(state.rows[codeListId].content, searchTerm);
            }
        );
    }

    function applySearch() {
        if (!state.searchInput) {
            return;
        }

        var searchTerm = lowerCase(state.searchInput.value).trim();

        Object.keys(state.rows).forEach(function (
            codeListId
        ) {
            //var row = state.rows[codeListId].row;

            var searchText = state.searchIndex[codeListId] || '';

            //var matches = !searchTerm || searchText.indexOf(searchTerm) !== -1;

            //row.style.display = matches ? 'block' : 'none';
        });

        highlightRenderedRows(searchTerm);

        rerenderOpenCodeLists();
    }

    function createAccordionRow(codeList) {
        var codeListId =
            codeList.Identification || '';

        var safeCodeListId = safeId(codeListId);

        var collapseId =
            'CODELIST_' + safeCodeListId;

        var headingId =
            'CODELIST_HEADING_' + safeCodeListId;

        var name = localized(
            codeList.Name,
            state.lang,
            codeListId
        );

        var row = createElement(
            'div',
            'accordion-row'
        );

        row.id = 'panel_' + safeCodeListId;

        row.setAttribute(
            'data-codelist',
            codeListId
        );

        var link = createElement(
            'a',
            'accordion-link collapsed'
        );

        link.id = headingId;
        link.href = '#' + collapseId;
        link.setAttribute('role', 'button');
        link.setAttribute('data-toggle', 'collapse');
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute(
            'aria-controls',
            collapseId
        );

        link.appendChild(
            document.createTextNode(
                codeListId +
                (name && name !== codeListId
                    ? ' - ' + name
                    : '')
            )
        );

        link.appendChild(
            createElement(
                'span',
                'icon icon-tulli-chevron-tight-down'
            )
        );

        link.lastChild.setAttribute(
            'aria-hidden',
            'true'
        );

        var collapse = createElement(
            'div',
            'accordion-content collapse'
        );

        collapse.id = collapseId;

        collapse.setAttribute(
            'data-codelist',
            codeListId
        );

        collapse.setAttribute(
            'aria-labelledby',
            headingId
        );

        var content = createElement(
            'div',
            'accordion-content-container'
        );

        content.setAttribute(
            'data-codelist',
            codeListId
        );

        content.setAttribute(
            'data-code-list-content',
            codeListId
        );

        collapse.appendChild(content);
        row.appendChild(link);
        row.appendChild(collapse);

        state.rows[codeListId] = {
            row: row,
            link: link,
            collapse: collapse,
            content: content
        };

        return row;
    }

    function renderCatalog() {
        state.target.innerHTML = '';

        var container = createElement(
            'div',
            'container'
        );

        var row = createElement(
            'div',
            'row'
        );

        var accordion = createElement(
            'div',
            'accordion'
        );

        state.rows = Object.create(null);

        state.codeLists.forEach(function (codeList) {
            if (
                !codeList ||
                !codeList.Identification
            ) {
                return;
            }

            accordion.appendChild(
                createAccordionRow(codeList)
            );
        });

        row.appendChild(accordion);
        container.appendChild(row);
        state.target.appendChild(container);
    }

    function renderCodeListPanel(collapse) {
        if (
            !collapse ||
            !global.MIGCodeListRenderer
        ) {
            return;
        }

        var codeListId =
            collapse.getAttribute('data-codelist');

        var record = state.rows[codeListId];

        if (!record) {
            return;
        }

        var target = record.content;
        var searchTerm = currentSearchTerm();

        if (
            target.dataset.renderedDate === state.selectedDate &&
            target.dataset.renderedSearch === searchTerm
        ) {
            return;
        }

        target.innerHTML = '';

        global.MIGCodeListRenderer.renderCodeList(
            state.data,
            target,
            {
                codeListId: codeListId,
                lang: state.lang,
                date: state.selectedDate,
                pageSize: state.pageSize,
                itemFilter: function (item) {
                    return codeItemMatchesSearch(
                        item,
                        searchTerm
                    );
                }
            }
        );

        target.dataset.renderedDate =
            state.selectedDate;

        target.dataset.renderedSearch =
            searchTerm;
    }

    function invalidateRenderedCodeLists() {
        Object.keys(state.rows).forEach(function (codeListId) {
            var target = state.rows[codeListId].content;

            target.innerHTML = '';

            delete target.dataset.renderedDate;
        });
    }

    function rerenderOpenCodeLists() {
        Object.keys(state.rows).forEach(function (codeListId) {
            var collapse =
                state.rows[codeListId].collapse;

            if (collapse.classList.contains('in') || collapse.classList.contains('show')) {
                renderCodeListPanel(collapse);
            }
        });
    }

    function observeCodeListContent(content) {
        if (!content || content._migCodesSearchObserver) {
            return;
        }

        var observer = new MutationObserver(
            function () {
                highlightRowsInContent(content, currentSearchTerm());
            }
        );

        observer.observe(content, {
            childList: true,
            subtree: true
        });

        content._migCodesSearchObserver =
            observer;
    }

    function setSelectedDate(value) {
        var selectedDate = normalizeIsoDate(value);

        if (selectedDate === state.selectedDate) {
            return;
        }

        state.selectedDate = selectedDate;

        invalidateRenderedCodeLists();
        buildSearchIndex();
        applySearch();
    }

    function initializeDatePicker() {
        var input = state.dateInput;

        if (!input) {
            return;
        }

        if (
            global.jQuery &&
            global.jQuery.fn &&
            typeof global.jQuery.fn.daterangepicker ===
            'function' &&
            global.moment
        ) {
            var $input = global.jQuery(input);

            $input.daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,

                startDate: global.moment(
                    state.selectedDate,
                    'YYYY-MM-DD'
                ),

                minDate: global.moment()
                    .subtract(10, 'years')
                    .startOf('year'),

                maxDate: global.moment(
                    '2099-12-31',
                    'YYYY-MM-DD'
                ),

                opens: 'center',
                drops: 'auto',

                locale: {
                    format: datePickerFormat(state.lang),
                    firstDay: 1,
                    daysOfWeek: t('codesPage.datePicker.daysOfWeek'),
                    monthNames: t('codesPage.datePicker.monthNames')
                }
            });

            $input.on(
                'apply.daterangepicker.migCodes',
                function (event, picker) {
                    setSelectedDate(
                        picker.startDate.format(
                            'YYYY-MM-DD'
                        )
                    );
                }
            );

            return;
        }

        /*
         * Basic fallback when daterangepicker is unavailable.
         */
        input.type = 'date';
        input.value = state.selectedDate;

        input.addEventListener(
            'change',
            function () {
                setSelectedDate(input.value);
            }
        );
    }

    function bindSearch() {
        if (!state.searchInput) {
            return;
        }

        var timer = null;

        state.searchInput.addEventListener(
            'input',
            function () {
                global.clearTimeout(timer);

                timer = global.setTimeout(
                    applySearch,
                    120
                );
            }
        );
    }

    function bindAccordion() {
        if (
            global.jQuery &&
            global.jQuery.fn
        ) {
            global.jQuery(state.target).on(
                'show.bs.collapse.migCodes',
                '.accordion-content',
                function () {
                    renderCodeListPanel(this);
                }
            );

            return;
        }

        /*
         * Bootstrap normally handles these links. This fallback
         * provides basic behavior without jQuery collapse.
         */
        state.target.addEventListener(
            'click',
            function (event) {
                var link = event.target;

                while (
                    link &&
                    link !== state.target &&
                    !link.classList.contains(
                        'accordion-link'
                    )
                ) {
                    link = link.parentNode;
                }

                if (
                    !link ||
                    link === state.target
                ) {
                    return;
                }

                event.preventDefault();

                var collapseId =
                    link.getAttribute('aria-controls');

                var collapse =
                    document.getElementById(collapseId);

                if (!collapse) {
                    return;
                }

                var isOpen =
                    collapse.classList.contains('in');

                if (isOpen) {
                    collapse.classList.remove('in');
                    collapse.style.display = 'none';

                    link.classList.add('collapsed');

                    link.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                } else {
                    renderCodeListPanel(collapse);

                    collapse.classList.add('in');
                    collapse.style.display = 'block';

                    link.classList.remove('collapsed');

                    link.setAttribute(
                        'aria-expanded',
                        'true'
                    );
                }
            }
        );
    }

    function scrollToElement(element) {
        if (!element) {
            return;
        }

        var top =
            element.getBoundingClientRect().top +
            global.pageYOffset -
            40;

        if (
            global.jQuery &&
            global.jQuery.fn
        ) {
            global.jQuery('html, body').animate(
                {
                    scrollTop: top
                },
                400
            );

            return;
        }

        global.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    function openHashTarget() {
        var hash = global.location.hash || '';

        if (!hash) {
            return false;
        }

        var targetId;

        try {
            targetId = decodeURIComponent(
                hash.slice(1)
            );
        } catch (ignore) {
            return false;
        }

        var collapse =
            document.getElementById(targetId);

        if (
            !collapse ||
            !state.target.contains(collapse) ||
            !collapse.classList.contains(
                'accordion-content'
            )
        ) {
            return false;
        }

        renderCodeListPanel(collapse);

        if (
            global.jQuery &&
            global.jQuery.fn
        ) {
            var $collapse =
                global.jQuery(collapse);

            if (
                $collapse.hasClass('in') ||
                $collapse.hasClass('show')
            ) {
                scrollToElement(collapse);
            } else {
                $collapse.one(
                    'shown.bs.collapse.migCodesHash',
                    function () {
                        scrollToElement(collapse);
                    }
                );

                $collapse.collapse('show');
            }

            return true;
        }

        collapse.classList.add('in');
        collapse.style.display = 'block';

        var record =
            state.rows[
            collapse.getAttribute(
                'data-codelist'
            )
            ];

        if (record) {
            record.link.classList.remove(
                'collapsed'
            );

            record.link.setAttribute(
                'aria-expanded',
                'true'
            );
        }

        scrollToElement(collapse);

        return true;
    }

    function initCodesPage(options) {
        options = options || {};

        var target = document.querySelector(
            options.target || '#contents'
        );

        if (!target) {
            return Promise.resolve(null);
        }

        if (
            target.dataset.migCodesInitialized ===
            'true'
        ) {
            return Promise.resolve(state);
        }

        target.dataset.migCodesInitialized = 'true';

        var lang =
            options.lang ||
            (
                global.MIGIntro &&
                    typeof global.MIGIntro.getLang ===
                    'function'
                    ? global.MIGIntro.getLang()
                    : ''
            ) ||
            document.body.dataset.lang ||
            document.documentElement.lang ||
            'en';

        state = {
            target: target,
            lang: lang,
            data: null,
            codeLists: [],
            rows: Object.create(null),
            searchIndex: Object.create(null),
            searchInput: document.querySelector(
                options.searchTarget ||
                '#accordion_search_bar'
            ),
            dateInput: document.querySelector(
                options.dateTarget ||
                '#dateInput'
            ),
            selectedDate: normalizeIsoDate(
                options.date || todayIso()
            ),
            codeListsUrl:
                options.codeListsUrl ||
                document.body.getAttribute(
                    'data-codelists-url'
                ) ||
                '../../../../codelists/codelists.json',
            pageSize: Math.max(
                1,
                Number(options.pageSize) || 100
            )
        };

        target.textContent = t('codesPage.loading');

        initializeDatePicker();
        bindSearch();

        return loadJson(state.codeListsUrl)
            .then(function (data) {
                state.data = data || {};

                state.codeLists =
                    Array.isArray(state.data.CodeLists)
                        ? state.data.CodeLists
                        : [];

                appendGeneratedTimestamp(state.data);
                renderCatalog();
                buildSearchIndex();
                applySearch();
                bindAccordion();

                openHashTarget();

                global.addEventListener(
                    'hashchange',
                    openHashTarget
                );

                return state;
            })
            .catch(function (error) {
                renderErrorAlert(
                    state.target,
                    t('codesPage.loadError'),
                    error
                );

                return null;
            });
    }

    function autoInitCodesPage() {
        if (!document.querySelector('#contents')) {
            return;
        }

        if (!document.querySelector('#dateInput')) {
            return;
        }

        initCodesPage();
    }

    global.MIG_I18N.ready(autoInitCodesPage);

    global.MIGCodes = {
        init: initCodesPage
    };
})(window);