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
    var announceStatus = global.MIGUtils.announceStatus;
    var renderErrorAlert = global.MIGUtils.renderErrorAlert;

    function lowerCase(value) {
        return String(value || '').toLocaleLowerCase(localeForLanguage(state.lang));
    }

    function appendGeneratedTimestamp(data) {
        var generated = data && (data.Generated || data.generated);

        if (!generated) {
            return;
        }

        var navbar = document.querySelector('.main-navbar');

        if (!navbar || navbar.dataset.codeListsGenerated === 'true') {
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

        var generatedTime = twoDigits(generatedDate.getHours()) + '.' + twoDigits(generatedDate.getMinutes());

        var headerText = [
            t('pageTitles.codes'),
            formatDisplayDate(localDate, state.lang),
            generatedTime
        ].join(' ');

        var oldHeader = navbar.querySelector('.mig-header-info');

        if (oldHeader) {
            oldHeader.remove();
        }

        navbar.appendChild(createElement('span', 'mig-header-info', ' ' + headerText));

        navbar.dataset.codeListsGenerated = 'true';
    }

    function codeListSearchText(codeList, selectedDate) {
        codeList = codeList || {};

        var parts = [
            codeList.Identification || '',
            localized(codeList.Name, state.lang, ''),
            localized(codeList.Description, state.lang, '')
        ];

        var items = Array.isArray(codeList.CodeItems) ? codeList.CodeItems : [];

        items.forEach(function (item) {
            if (!isActiveOnDate(item, selectedDate)) {
                return;
            }

            parts.push(item.Code || '');
            parts.push(localized(item.Name, state.lang, ''));
            parts.push(localized(item.Description, state.lang, ''
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

    function currentSearchTerm() {
        if (!state.searchInput) {
            return '';
        }

        return lowerCase(state.searchInput.value).trim();
    }

    function highlightRowsInContent(content, searchTerm) {
        if (!content) {
            return;
        }

        var rows = content.querySelectorAll('.code-list-table tbody tr');

        Array.prototype.forEach.call(
            rows,
            function (row) {
                // Ignore informational rows such as the "no items" message.
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
            var row = state.rows[codeListId].row;
            var searchText = state.searchIndex[codeListId] || '';
            var matches = !searchTerm || searchText.indexOf(searchTerm) !== -1;

            row.style.display = matches ? 'block' : 'none';
        });

        highlightRenderedRows(searchTerm);
        rerenderOpenCodeLists();
    }

    function createAccordionRow(codeList) {
        var codeListId = codeList.Identification || '';
        var safeCodeListId = safeId(codeListId);
        var collapseId = 'CODELIST_' + safeCodeListId;
        var headingId = 'CODELIST_HEADING_' + safeCodeListId;
        var name = localized(codeList.Name, state.lang, codeListId);
        var row = createElement('div', 'accordion-row');

        row.id = 'panel_' + safeCodeListId;
        row.setAttribute('data-codelist', codeListId);

        var button = createElement('button', 'accordion-link collapsed');

        button.id = headingId;
        button.setAttribute('type', 'button');
        button.setAttribute('data-toggle', 'collapse');
        button.setAttribute('data-target', '#' + collapseId);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', collapseId);
        button.appendChild(document.createTextNode(codeListId + (name && name !== codeListId ? ' - ' + name : '')));
        button.appendChild(createElement('span', 'icon icon-tulli-chevron-tight-down'));
        button.lastChild.setAttribute('aria-hidden', 'true');

        var collapse = createElement('div', 'accordion-content collapse');

        collapse.id = collapseId;
        collapse.setAttribute('data-codelist', codeListId);

        var heading = createElement('h2', 'accordion-heading');

        heading.appendChild(button);

        var content = createElement('div', 'accordion-content-container');

        content.setAttribute('data-codelist', codeListId);
        content.setAttribute('data-code-list-content', codeListId);
        collapse.appendChild(content);

        row.appendChild(heading);
        row.appendChild(collapse);

        state.rows[codeListId] = {
            row: row,
            link: button,
            collapse: collapse,
            content: content
        };

        observeCodeListContent(content);

        return row;
    }

    function renderCatalog() {
        state.target.innerHTML = '';

        var container = createElement('div', 'container');
        var row = createElement('div', 'row');
        var accordion = createElement('div', 'accordion');

        state.rows = Object.create(null);

        state.codeLists.forEach(function (codeList) {
            if (!codeList || !codeList.Identification) {
                return;
            }

            accordion.appendChild(createAccordionRow(codeList));
        });

        row.appendChild(accordion);
        container.appendChild(row);
        state.target.appendChild(container);
    }

    function renderCodeListPanel(collapse) {
        if (!collapse || !global.MIGCodeListRenderer) {
            return;
        }

        var codeListId = collapse.getAttribute('data-codelist');
        var record = state.rows[codeListId];

        if (!record) {
            return;
        }

        var target = record.content;

        if (target.dataset.renderedDate === state.selectedDate) {
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
                pageSize: state.pageSize
            }
        );

        target.dataset.renderedDate = state.selectedDate;

        highlightRowsInContent(target, currentSearchTerm());
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

        content._migCodesSearchObserver = observer;
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

        announceStatus(t('codesPage.updated'));
    }

    var calendarGridButtonSelector = '.vc-date__btn, ' + '.vc-months__month, ' + '.vc-years__year';

    function normalizeCalendarAccessibility(root) {
        if (!root) {
            return;
        }

        var buttons =
            Array.prototype.slice.call(root.querySelectorAll(calendarGridButtonSelector));

        if (!buttons.length) {
            return;
        }

        var focused = buttons.indexOf(document.activeElement) !== -1 ? document.activeElement : null;

        var selected = null;
        var today = null;

        buttons.forEach(function (button) {
            var cell = button.closest('[role="gridcell"]');

            if (!cell) {
                return;
            }

            var isSelected =
                cell.getAttribute('aria-selected') === 'true' ||
                button.getAttribute('aria-selected') === 'true' ||
                cell.hasAttribute('data-vc-date-selected') ||
                button.hasAttribute('data-vc-months-month-selected') ||
                button.hasAttribute('data-vc-years-year-selected');

            if (isSelected) {
                selected = selected || button;

                cell.setAttribute('aria-selected', 'true');
            } else {
                cell.removeAttribute('aria-selected');
            }

            // Selection belongs to the gridcell.
            button.removeAttribute('aria-selected');

            if (cell.hasAttribute('data-vc-date-today')) {
                today = button;
            }

            button.setAttribute('tabindex', '-1');
        });

        var active = focused || selected || today || buttons[0];

        if (active) {
            active.setAttribute('tabindex', '0');
        }
    }

    function initializeCalendarAccessibility(root) {
        if (!root) {
            return;
        }

        normalizeCalendarAccessibility(root);

        if (root.dataset.migAccessibilityInitialized === 'true') {
            return;
        }

        root.dataset.migAccessibilityInitialized = 'true';

        root.addEventListener(
            'focusin',
            function (event) {
                if (!event.target.matches || !event.target.matches(calendarGridButtonSelector)) {
                    return;
                }

                root.querySelectorAll(calendarGridButtonSelector).forEach(function (button) {
                    button.setAttribute('tabindex', button === event.target ? '0' : '-1');
                });
            }
        );

        var observer =
            new MutationObserver(
                function () {
                    normalizeCalendarAccessibility(
                        root
                    );
                }
            );

        observer.observe(
            root,
            {
                childList: true,
                subtree: true
            }
        );
    }

    function syncCalendarAccessibility() {
        window.requestAnimationFrame(
            function () {
                var root = document.querySelector('.vc[data-vc="calendar"]' + '[data-vc-input]');

                if (!root) {
                    return;
                }

                root.id = 'codesDatePicker';
                root.setAttribute('role', 'dialog');
                root.removeAttribute('tabindex');

                state.dateInput.setAttribute('aria-controls', root.id);

                initializeCalendarAccessibility(root);
            }
        );
    }

    function initializeDatePicker() {
        var input = state.dateInput;

        if (!input) {
            return;
        }

        var Calendar = global.VanillaCalendarPro && global.VanillaCalendarPro.Calendar;

        if (typeof Calendar !== 'function') {
            // Safe native fallback if the library is ever unavailable.
            input.type = 'date';
            input.value = state.selectedDate;

            input.addEventListener(
                'change',
                function () {
                    setSelectedDate(input.value);
                }
            );

            return;
        }

        var today = new Date();
        var minimumDate = String(today.getFullYear() - 10) + '-01-01';
        var maximumDate = '2099-12-31';

        // Vanilla Calendar input mode deliberately leaves control of the visible input value to the application.
        input.value = formatDisplayDate(state.selectedDate, state.lang);
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-haspopup', 'dialog');

        input.setAttribute('aria-expanded', 'false');

        var calendar = new Calendar(
            input,
            {
                inputMode: true,
                positionToInput: 'auto',
                locale: localeForLanguage(state.lang),
                firstWeekday: 1,
                selectionDatesMode: 'single',
                selectedDates: [state.selectedDate],
                enableJumpToSelectedDate: true,
                dateMin: minimumDate,
                dateMax: maximumDate,
                displayDateMin: minimumDate,
                displayDateMax: maximumDate,
                labels: {
                    application: t('codesPage.datePicker.labels.calendar'),
                    navigation: t('codesPage.datePicker.labels.navigation'),
                    arrowNext: {
                        month: t('codesPage.datePicker.labels.nextMonth'),
                        year: t('codesPage.datePicker.labels.nextYears')
                    },
                    arrowPrev: {
                        month: t('codesPage.datePicker.labels.previousMonth'),
                        year: t('codesPage.datePicker.labels.previousYears')
                    },
                    month: t('codesPage.datePicker.labels.selectMonth'),
                    months: t('codesPage.datePicker.labels.months'),
                    year: t('codesPage.datePicker.labels.selectYear'),
                    years: t('codesPage.datePicker.labels.years'),
                    week: t('codesPage.datePicker.labels.week'),
                    dates: t('codesPage.datePicker.labels.dates')
                },
                onChangeToInput: function (self) {
                    var selectedDates = self.context && self.context.selectedDates;

                    if (!selectedDates || !selectedDates.length) {
                        return;
                    }

                    var selectedDate = selectedDates[0];

                    input.value = formatDisplayDate(selectedDate, state.lang);

                    setSelectedDate(selectedDate);
                },
                onInit: function () {
                    syncCalendarAccessibility();
                },
                onShow: function () {
                    input.setAttribute('aria-expanded', 'true');

                    syncCalendarAccessibility();
                },
                onHide: function () {
                    input.setAttribute('aria-expanded', 'false');
                },
            }
        );

        calendar.init();

        document.addEventListener(
            'keydown',
            function (event) {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                    return;
                }

                var calendarElement = event.target.closest ? event.target.closest('.vc') : null;

                if (!calendarElement) {
                    return;
                }

                event.preventDefault();
            },
            true
        );

        state.datePicker = calendar;
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
                    function () {
                        applySearch();

                        announceStatus(t('codesPage.updated'));
                    },
                    120
                );
            }
        );
    }

    function bindAccordion() {
        if (global.jQuery && global.jQuery.fn) {
            global.jQuery(state.target).on(
                'show.bs.collapse.migCodes',
                '.accordion-content',
                function () {
                    renderCodeListPanel(this);
                }
            );

            return;
        }

        // provides basic behavior without jQuery collapse.
        state.target.addEventListener(
            'click',
            function (event) {
                var link = event.target;

                while (link && link !== state.target && !link.classList.contains('accordion-link')) {
                    link = link.parentNode;
                }

                if (!link || link === state.target) {
                    return;
                }

                event.preventDefault();

                var collapseId = link.getAttribute('aria-controls');
                var collapse = document.getElementById(collapseId);

                if (!collapse) {
                    return;
                }

                var isOpen = collapse.classList.contains('in');

                if (isOpen) {
                    collapse.classList.remove('in');
                    collapse.style.display = 'none';

                    link.classList.add('collapsed');

                    link.setAttribute('aria-expanded', 'false');
                } else {
                    renderCodeListPanel(collapse);

                    collapse.classList.add('in');
                    collapse.style.display = 'block';

                    link.classList.remove('collapsed');

                    link.setAttribute('aria-expanded', 'true');
                }
            }
        );
    }

    function scrollToElement(element) {
        if (!element) {
            return;
        }

        var top = element.getBoundingClientRect().top + global.pageYOffset - 80;

        if (global.jQuery && global.jQuery.fn) {
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

        var collapse = document.getElementById(targetId);

        if (!collapse || !state.target.contains(collapse) || !collapse.classList.contains('accordion-content')) {
            return false;
        }

        renderCodeListPanel(collapse);

        if (global.jQuery && global.jQuery.fn) {
            var $collapse = global.jQuery(collapse);

            if ($collapse.hasClass('in') || $collapse.hasClass('show')) {
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

        var record = state.rows[collapse.getAttribute('data-codelist')];

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

        var target = document.querySelector(options.target || '#contents');

        if (!target) {
            return Promise.resolve(null);
        }

        if (target.dataset.migCodesInitialized === 'true') {
            return Promise.resolve(state);
        }

        target.dataset.migCodesInitialized = 'true';

        var lang =
            options.lang ||
            (global.MIGIntro && typeof global.MIGIntro.getLang === 'function' ? global.MIGIntro.getLang() : '') ||
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
            searchInput: document.querySelector(options.searchTarget || '#accordion_search_bar'),
            dateInput: document.querySelector(options.dateTarget || '#dateInput'),
            selectedDate: normalizeIsoDate(options.date || todayIso()),
            codeListsUrl:
                options.codeListsUrl ||
                document.body.getAttribute('data-codelists-url') ||
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

                state.codeLists = Array.isArray(state.data.CodeLists) ? state.data.CodeLists : [];

                appendGeneratedTimestamp(state.data);
                renderCatalog();
                buildSearchIndex();
                applySearch();
                bindAccordion();

                openHashTarget();

                global.addEventListener('hashchange', openHashTarget);

                return state;
            })
            .catch(function (error) {
                renderErrorAlert(state.target, t('codesPage.loadError'), error
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