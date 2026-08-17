(function (global) {
    'use strict';

    var jsonCache = new Map();

    function t(key) {
        return global.MIG_I18N.t(key);
    }

    function el(tagName, options, text) {
        var node = document.createElement(tagName);

        if (typeof options === 'string' || (options == null && arguments.length > 2)) {
            options = {
                className: options || '',
                text: text
            };
        } else {
            options = options || {};
        }

        if (options.className) {
            node.className = options.className;
        }

        if (options.text !== undefined && options.text !== null) {
            node.textContent = String(options.text);
        }

        if (options.html !== undefined && options.html !== null) {
            node.innerHTML = String(options.html);
        }

        if (options.attrs) {
            Object.keys(options.attrs).forEach(function (name) {
                var value = options.attrs[name];

                if (value !== undefined && value !== null) {
                    node.setAttribute(name, String(value));
                }
            });
        }

        return node;
    }

    function localizedValue(value, lang, fallback, coerceArrays) {
        fallback = fallback || '';

        if (value == null) {
            return fallback;
        }

        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value)) {
            return coerceArrays ? String(value) : fallback;
        }

        if (typeof value === 'object') {
            return value[lang] || value.en || value.fi || value.sv || fallback;
        }

        return String(value);
    }

    function localized(value, lang, fallback) {
        return localizedValue(value, lang, fallback, false);
    }

    function localizedCoerce(value, lang, fallback) {
        return localizedValue(value, lang, fallback, true);
    }

    function loadJson(url) {
        if (!jsonCache.has(url)) {
            jsonCache.set(url, fetch(url).then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        'Could not load ' + url + ': ' +
                        response.status + ' ' + response.statusText
                    );
                }

                return response.json();
            }));
        }

        return jsonCache.get(url);
    }


    function safeId(value) {
        return String(value || '')
            .replace(/[^A-Za-z0-9_-]/g, '_');
    }

    function localeForLanguage(lang) {
        switch (lang) {
            case 'fi':
                return 'fi-FI';
            case 'sv':
                return 'sv-FI';
            default:
                return 'en-GB';
        }
    }

    function formatDisplayDate(value, lang) {
        if (!value) return '';

        var datePart = String(value).slice(0, 10);
        var match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (!match) {
            return String(value);
        }

        var year = match[1];
        var month = Number(match[2]);
        var day = Number(match[3]);

        return lang === 'en'
            ? day + '/' + month + '/' + year
            : day + '.' + month + '.' + year;
    }

    function normalizeIsoDate(value) {
        if (!value) {
            return todayIso();
        }

        if (value instanceof Date) {
            if (isNaN(value.getTime())) {
                throw new Error('Invalid date.');
            }

            return [
                value.getFullYear(),
                twoDigits(value.getMonth() + 1),
                twoDigits(value.getDate())
            ].join('-');
        }

        var text = String(value).trim();
        var match = text.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );

        if (!match) {
            throw new Error(
                'Invalid date "' +
                text +
                '". Expected YYYY-MM-DD.'
            );
        }

        var year = Number(match[1]);
        var month = Number(match[2]);
        var day = Number(match[3]);

        var date = new Date(
            year,
            month - 1,
            day
        );

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            throw new Error(
                'Invalid date "' + text + '".'
            );
        }

        return text;
    }

    function twoDigits(value) {
        return value < 10 ? '0' + value : String(value);
    }

    function todayIso() {
        var today = new Date();

        return [
            today.getFullYear(),
            twoDigits(today.getMonth() + 1),
            twoDigits(today.getDate())
        ].join('-');
    }

    function isActiveOnDate(item, selectedDate) {
        item = item || {};

        var startDate = item.startDate || item.StartDate || '';
        var endDate = item.endDate || item.EndDate || '';

        return (!startDate || startDate <= selectedDate) &&
            (!endDate || endDate >= selectedDate);
    }

    function markdownToHtml(value, options) {
        options = options || {};

        var markdown = String(value || '');
        if (!markdown) return '';

        if (!global.marked) {
            return '';
        }

        var html;

        if (typeof global.marked.parse === 'function') {
            html = global.marked.parse(markdown, { breaks: true });
        } else if (typeof global.marked === 'function') {
            html = global.marked(markdown, { breaks: true });
        } else {
            return '';
        }

        if (options.tableClass) {
            html = html.replaceAll(
                '<table>',
                '<table class="' + options.tableClass + '">'
            );
        }

        return html;
    }

    function externalizeLinks(root) {
        root.querySelectorAll('a[href]').forEach(function (link) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function resolveElement(target) {
        if (!target) return null;
        return typeof target === 'string'
            ? document.querySelector(target)
            : target;
    }

    function renderEmptyState(target, translationKey) {
        target.innerHTML = '';
        target.appendChild(el('p', {
            text: t(translationKey)
        }));
    }

    function renderErrorAlert(target, message, error) {
        target = resolveElement(target);

        if (!target) {
            return null;
        }

        target.innerHTML = '';

        var alert = el('div', {
            className: 'alert alert-danger',
            text: message
        });

        target.appendChild(alert);

        if (error) {
            console.warn(error);
        }

        return alert;
    }

    function initScrollableTabs() {
        function updateScrollButtons(wrapper, tabs) {
            var previous =
                wrapper.querySelector(
                    '[data-tabs-scroll="previous"]'
                );

            var next =
                wrapper.querySelector(
                    '[data-tabs-scroll="next"]'
                );

            if (!previous || !next) {
                return;
            }

            var hasOverflow =
                tabs.scrollWidth > tabs.clientWidth + 1;

            previous.classList.toggle(
                'is-visible',
                hasOverflow
            );

            next.classList.toggle(
                'is-visible',
                hasOverflow
            );

            if (!hasOverflow) {
                return;
            }

            var atStart =
                tabs.scrollLeft <= 1;

            var atEnd =
                tabs.scrollLeft +
                tabs.clientWidth >=
                tabs.scrollWidth - 1;

            previous.disabled = atStart;
            next.disabled = atEnd;
        }

        document.querySelectorAll(
            '.mig-tabs-scroll'
        ).forEach(function (wrapper) {
            var tabs =
                wrapper.querySelector(
                    '.messagetabs'
                );

            var previous =
                wrapper.querySelector(
                    '[data-tabs-scroll="previous"]'
                );

            var next =
                wrapper.querySelector(
                    '[data-tabs-scroll="next"]'
                );

            if (!tabs || !previous || !next) {
                return;
            }

            previous.addEventListener(
                'click',
                function () {
                    tabs.scrollBy({
                        left: -200,
                        behavior: 'smooth'
                    });
                }
            );

            next.addEventListener(
                'click',
                function () {
                    tabs.scrollBy({
                        left: 200,
                        behavior: 'smooth'
                    });
                }
            );

            tabs.addEventListener(
                'scroll',
                function () {
                    updateScrollButtons(
                        wrapper,
                        tabs
                    );
                }
            );

            window.addEventListener(
                'resize',
                function () {
                    updateScrollButtons(
                        wrapper,
                        tabs
                    );
                }
            );

            updateScrollButtons(
                wrapper,
                tabs
            );
        });
    }

    global.MIGUtils = {
        t: t,
        el: el,
        localized: localized,
        localizedCoerce: localizedCoerce,
        loadJson: loadJson,
        safeId: safeId,
        localeForLanguage: localeForLanguage,
        formatDisplayDate: formatDisplayDate,
        normalizeIsoDate: normalizeIsoDate,
        twoDigits: twoDigits,
        todayIso: todayIso,
        isActiveOnDate: isActiveOnDate,
        markdownToHtml: markdownToHtml,
        externalizeLinks: externalizeLinks,
        escapeHtml: escapeHtml,
        resolveElement: resolveElement,
        renderEmptyState: renderEmptyState,
        renderErrorAlert: renderErrorAlert,
        initScrollableTabs: initScrollableTabs
    };
})(window);
