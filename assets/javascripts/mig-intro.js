(function () {
    'use strict';

    var t = window.MIGUtils.t;
    var el = window.MIGUtils.el;
    var localized = window.MIGUtils.localized;
    var loadJson = window.MIGUtils.loadJson;
    var resolveElement = window.MIGUtils.resolveElement;
    var escapeHtml = window.MIGUtils.escapeHtml;
    var formatDisplayDate = window.MIGUtils.formatDisplayDate;

    function getLang() {
        return (document.body && document.body.dataset && document.body.dataset.lang) || document.documentElement.lang || (window.MIG_I18N && window.MIG_I18N.lang) || 'en';
    }

    function richTextToHtml(value) {
        var html = escapeHtml(value || '');

        // The change texts sometimes contain real HTML fragments such as <i>, <ul>, and <li>, but they also contain literal placeholders such as <Decisive Date>. Escape everything first, then selectively restore only the harmless formatting tags we expect.
        html = html
            .replace(/&lt;(\/?)i&gt;/gi, '<$1i>')
            .replace(/&lt;(\/?)em&gt;/gi, '<$1em>')
            .replace(/&lt;(\/?)strong&gt;/gi, '<$1strong>')
            .replace(/&lt;(\/?)b&gt;/gi, '<$1b>')
            .replace(/&lt;(\/?)ul&gt;/gi, '<$1ul>')
            .replace(/&lt;(\/?)ol&gt;/gi, '<$1ol>')
            .replace(/&lt;(\/?)li&gt;/gi, '<$1li>')
            .replace(/&lt;br\s*\/?&gt;/gi, '<br>');

        return html;
    }

    function tooltipHtml(value) {
        return richTextToHtml(value).replace(/\r\n|\n|\r/g, '<br>');
    }

    function commonBaseUrl(introUrl) {
        return String(introUrl || defaultIntroUrl()).replace(/intro\.json(?:\?.*)?$/i, '');
    }

    function versionedCommonUrl(versionId, relativePath, introUrl) {
        relativePath = relativePath || '';

        return commonBaseUrl(introUrl) +
            encodeURIComponent(versionId) +
            '/' +
            relativePath.replace(/^\/+/, '');
    }

    function defaultIntroUrl() {
        var parts = window.location.pathname.split('/').filter(Boolean);

        var langIndex = -1;

        parts.forEach(function (part, index) {
            if (langIndex === -1 && /^(fi|sv|en)$/i.test(part)) {
                langIndex = index;
            }
        });

        if (langIndex === -1) return '../common/intro.json';

        var isPageUnderLanguage = parts[langIndex + 1] === 'pages';

        return isPageUnderLanguage
            ? '../../common/intro.json'
            : '../common/intro.json';
    }

    function loadIntro(url) {
        return loadJson(url || defaultIntroUrl());
    }

    function versionIds(intro) {
        return Object.keys((intro && intro.Versions) || {});
    }

    function latestManifestVersionId(intro) {
        var ids = versionIds(intro);
        return ids.length ? ids[ids.length - 1] : '';
    }

    function parseReleaseDate(value) {
        if (!value) return null;
        var text = String(value).trim();
        var match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (match) {
            var year = Number(match[1]);
            var month = Number(match[2]) - 1;
            var day = Number(match[3]);
            var hour = Number(match[4] || 0);
            var minute = Number(match[5] || 0);
            var second = Number(match[6] || 0);
            var parsed = new Date(year, month, day, hour, minute, second).getTime();
            return Number.isNaN(parsed) ? null : parsed;
        }
        var fallback = Date.parse(text);
        return Number.isNaN(fallback) ? null : fallback;
    }

    function currentVersionId(intro, options) {
        options = options || {};
        var ids = versionIds(intro);
        if (!ids.length) return '';

        var now = options.now instanceof Date ? options.now.getTime() : typeof options.now === 'number' ? options.now : Date.now();
        var bestId = '';
        var bestTime = -Infinity;
        var bestIndex = -1;

        ids.forEach(function (versionId, index) {
            var releaseTime = parseReleaseDate(versionInfo(intro, versionId).releaseDate);
            if (releaseTime == null || releaseTime > now) return;
            if (releaseTime > bestTime || (releaseTime === bestTime && index > bestIndex)) {
                bestId = versionId;
                bestTime = releaseTime;
                bestIndex = index;
            }
        });

        // If the manifest only contains future or undated versions, fall back to the last manifest entry so the page still renders deterministically.
        return bestId || latestManifestVersionId(intro);
    }

    function latestVersionId(intro, options) {
        // Backwards-compatible alias: in the UI, "latest" means the latest released version, not necessarily the final entry in a manifest that may include future versions.
        return currentVersionId(intro, options);
    }

    function versionEntry(intro, versionId) {
        return intro && intro.Versions ? intro.Versions[versionId] : null;
    }

    function versionInfo(intro, versionId) {
        var entry = versionEntry(intro, versionId);
        return entry && entry.info ? entry.info : {};
    }

    function systemName(intro, lang) {
        return localized(intro && intro.System, lang || getLang(), '');
    }

    function seoPageKey() {
        var filename = String(window.location.pathname || '').split('/').pop().toLowerCase();

        switch (filename) {
            case 'datarequirements.html':
                return 'dataRequirements';

            case 'messageexchange.html':
                return 'messageExchange';

            case 'datamodel.html':
                return 'classDiagram';

            case 'codes.html':
                return 'codes';

            case 'examples.html':
                return 'examples';

            default:
                return 'home';
        }
    }

    function setMetaContent(selector, attributes, content) {
        if (!content) return;

        var meta = document.head.querySelector(selector);

        if (!meta) {
            meta = document.createElement('meta');

            Object.keys(attributes).forEach(function (name) {
                meta.setAttribute(name, attributes[name]);
            });

            document.head.appendChild(meta);
        }

        meta.setAttribute('content', content);
    }

    function canonicalPageUrl() {
        var url = new URL(window.location.href);

        url.search = '';
        url.hash = '';

        return url.toString();
    }

    function setLinkHref(selector, attributes, href) {
        if (!href) return;

        var link = document.head.querySelector(selector);

        if (!link) {
            link = document.createElement('link');

            Object.keys(attributes).forEach(function (name) {
                link.setAttribute(name, attributes[name]);
            });

            document.head.appendChild(link);
        }

        link.setAttribute('href', href);
    }

    function applyCanonicalMetadata() {
        var canonical = canonicalPageUrl();

        setLinkHref('link[rel="canonical"]', { rel: 'canonical' }, canonical);
        setMetaContent('meta[property="og:url"]', { property: 'og:url' }, canonical);
    }

    function languagePageUrl(lang) {
        var url = new URL(canonicalPageUrl());
        var parts = url.pathname.split('/');
        var replaced = false;

        parts =
            parts.map(function (part) {
                if (!replaced && /^(fi|sv|en)$/i.test(part)) {
                    replaced = true;
                    return lang;
                }

                return part;
            });

        if (!replaced) return '';

        url.pathname = parts.join('/');

        return url.toString();
    }

    function applyLanguageAlternates() {
        ['fi', 'sv', 'en'].forEach(function (lang) {
            var href = languagePageUrl(lang);

            if (!href) return;

            setLinkHref('link[rel="alternate"]' + '[hreflang="' + lang + '"]', { rel: 'alternate', hreflang: lang }, href);
        });
    }
    
    function applySeoMetadata(intro, options) {
        options = options || {};

        var lang = options.lang || getLang();
        var system = systemName(intro, lang);
        var pageKey = options.pageKey || seoPageKey();
        var pageTitle = pageKey === 'home' ? t('siteTitle') : t('pageTitles.' + pageKey);
        var brand = t('seo.brand');
        var title = [pageTitle, system].filter(Boolean).join(' - ');

        if (brand) title += ' | ' + brand;

        var description = t('seo.descriptions.' + pageKey);

        if (description && system) description += ' – ' + system;

        if (title) {
            document.title = title;

            setMetaContent('meta[property="og:title"]', { property: 'og:title' }, title);
        }

        if (description) {
            setMetaContent('meta[name="description"]', { name: 'description' }, description);
            setMetaContent('meta[property="og:description"]', { property: 'og:description' }, description
            );
        }

        applyCanonicalMetadata();
        applyLanguageAlternates();
    }

    function getVersionDate(intro, versionId, lang) {
        return formatDisplayDate(versionInfo(intro, versionId).releaseDate, lang);
    }

    function getVersionChanges(intro, versionId, lang) {
        var entry = versionEntry(intro, versionId);
        if (!entry) return [];
        var changes = entry[lang || getLang()];
        return Array.isArray(changes) ? changes : [];
    }

    function isTruthyFlag(value) {
        return value === true || value === 1 || value === '1' || value === 'true';
    }

    function sanitizeVersionId(versionId) {
        return String(versionId).replace(/[^A-Za-z0-9_-]/g, '_');
    }

    function updateVersionLinks(versionId, options) {
        options = options || {};

        var parameterName = options.queryParameter || 'version';

        if (!versionId) return;

        Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
            var rawHref = link.getAttribute('href');

            if (!rawHref) return;

            // Leave language links to mig-i18n.js because they may preserve hashes.
            if (link.hasAttribute('data-lang-option')) return;

            // Skip same-page anchors, modals, JS pseudo-links, mail links, etc.
            if (
                rawHref.charAt(0) === '#' ||
                /^javascript:/i.test(rawHref) ||
                /^mailto:/i.test(rawHref) ||
                /^tel:/i.test(rawHref)
            ) {
                return;
            }

            // Skip downloads and modal triggers.
            if (link.hasAttribute('download')) return;
            if (link.getAttribute('data-toggle') === 'modal') return;

            var url;

            try {
                url = new URL(rawHref, window.location.href);
            } catch (error) {
                return;
            }

            // Only same-origin HTML pages.
            if (url.origin !== window.location.origin) return;
            if (!/\.html?$/i.test(url.pathname)) return;

            url.searchParams.set(parameterName, versionId);

            // Important: page-to-page links should not inherit the current tab hash.
            url.hash = '';

            link.setAttribute(
                'href',
                url.pathname + url.search + url.hash
            );
        });
    }

    function getSystemPath() {
        var lang = getLang();
        var parts = window.location.pathname.split('/').filter(Boolean);
        var langIndex = parts.indexOf(lang);
        if (langIndex === -1) return parts.slice(0, Math.max(0, parts.length - 1)).join('/') || 'unknown-system';
        return parts.slice(0, langIndex).join('/') || 'root';
    }

    function storageKey() {
        return 'mig:' + getSystemPath() + ':activeVersion';
    }

    function isValidVersion(intro, versionId) {
        return !!versionId && Object.prototype.hasOwnProperty.call((intro && intro.Versions) || {}, versionId);
    }

    function resolveActiveVersion(intro, options) {
        options = options || {};
        var parameterName = options.queryParameter || 'version';
        var urlVersion = new URLSearchParams(window.location.search).get(parameterName);
        var key = storageKey();

        if (isValidVersion(intro, urlVersion)) {
            try { sessionStorage.setItem(key, urlVersion); } catch (ignore) { }
            return urlVersion;
        }

        var storedVersion = null;
        try { storedVersion = sessionStorage.getItem(key); } catch (ignore2) { }
        if (isValidVersion(intro, storedVersion)) return storedVersion;

        return currentVersionId(intro, options);
    }

    function setActiveVersion(intro, versionId, options) {
        options = options || {};
        if (!isValidVersion(intro, versionId)) return false;

        try { sessionStorage.setItem(storageKey(), versionId); } catch (ignore) { }

        if (options.updateUrl !== false) {
            var parameterName = options.queryParameter || 'version';
            var url = new URL(window.location.href);
            url.searchParams.set(parameterName, versionId);
            window.history.replaceState(null, '', url.toString());
        }
        return true;
    }

    function renderChangeList(target, changes, options) {
        target = resolveElement(target);
        if (!target) return;
        options = options || {};
        var lang = options.lang || getLang();
        target.innerHTML = '';

        var list = el('ol');
        if (!changes || !changes.length) {
            list.appendChild(el('li', { text: t('intro.noVersionChanges') }));
            target.appendChild(list);
            return;
        }

        changes.forEach(function (change) {
            var item = el('li');
            var text = typeof change === 'string' ? change : change.text;
            item.innerHTML = richTextToHtml(text || '');

            if (change && change.tooltip) {
                item.appendChild(document.createTextNode(' '));

                var detailsButton = el('button', {
                    className:
                        'mig-change-details',
                    text: t('intro.showDetails'),
                    attrs: {
                        type: 'button',
                        'data-toggle': 'tooltip',
                        'data-html': 'true',
                        'data-placement': 'top',
                        'data-container': 'body',
                        title: tooltipHtml(change.tooltip)
                    }
                });
                item.appendChild(detailsButton);

                var printDetails = el('div', { className: 'mig-change-details-print' });

                printDetails.innerHTML = tooltipHtml(change.tooltip);

                item.appendChild(printDetails);
            }
            list.appendChild(item);
        });
        target.appendChild(list);
    }

    function renderVersionModal(intro, versionId, lang) {
        var modalId = 'Version_' + sanitizeVersionId(versionId);
        var titleId = modalId + '_title';
        var modal = el('div', {
            className: 'modal fade',
            attrs: {
                id: modalId,
                tabindex: '-1',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': titleId
            }
        });

        var dialog = el('div', {
            className: 'modal-dialog modal-lg',
            attrs: { role: 'document' }
        });

        var content = el('div', { className: 'modal-content' });
        var header = el('div', { className: 'modal-header mig-version-modal-header' });
        var title = el('h2', { className: 'modal-title', attrs: { id: titleId } });

        title.appendChild(document.createTextNode(t('intro.version') + ' ' + versionId));

        header.appendChild(title);

        var printButton = el('button', {
            className: 'printButton btn btn-default btn-sm',
            attrs: {
                type: 'button',
                'aria-label': t('intro.print'),
                title: t('intro.print')
            }
        });

        printButton.appendChild(el('span', {
            className: 'icon icon-tulli-printer',
            attrs: { 'aria-hidden': 'true' }
        }));

        header.appendChild(printButton);

        var footer = el('div', { className: 'modal-footer' });

        footer.appendChild(el('button', {
            className: 'btn btn-default remove-bottom',
            text: t('browserModal.close'),
            attrs: {
                type: 'button',
                'data-dismiss': 'modal'
            }
        }));

        var body = el('div', { className: 'modal-body' });

        renderChangeList(body, getVersionChanges(intro, versionId, lang), { lang: lang });

        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);

        dialog.appendChild(content);
        modal.appendChild(dialog);
        return modal;
    }

    function renderVersionHistory(target, intro, options) {
        target = resolveElement(target);
        if (!target) return;
        options = options || {};
        var lang = options.lang || getLang();
        var ids = versionIds(intro);
        var headers = t('intro.versionHistoryHeaders');
        if (!Array.isArray(headers)) {
            throw new Error('Translation intro.versionHistoryHeaders must be an array.');
        }

        target.innerHTML = '';

        var table = el('table', { className: 'table table-striped table-responsive table-condensed', attrs: { id: 'versionHistoryTable' } });
        var thead = el('thead');
        var headerRow = el('tr');
        headers.forEach(function (headerText) {
            headerRow.appendChild(
                el('th', {
                    text: headerText,
                    attrs: { scope: 'col' }
                })
            );
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = el('tbody');
        ids.slice().reverse().forEach(function (versionId) {
            var info = versionInfo(intro, versionId);
            var row = el('tr');
            var versionCell = el('th', { attrs: { scope: 'row' } });
            var link = el('a', { attrs: { href: '#', 'data-toggle': 'modal', 'data-target': '#Version_' + sanitizeVersionId(versionId) } });
            link.appendChild(document.createTextNode(versionId));
            link.appendChild(el('br'));
            link.appendChild(document.createTextNode(formatDisplayDate(info.releaseDate, lang)));
            versionCell.appendChild(link);
            row.appendChild(versionCell);

            row.appendChild(el('td', { text: localized(info.remark, lang, '') }));

            ['xml', 'data', 'messageExchange']
                .forEach(function (flagName) {
                    var enabled = isTruthyFlag(info[flagName]);
                    var cell = el('td', { attrs: { align: 'center' } });

                    if (enabled) {
                        cell.appendChild(el('span', { text: '•', attrs: { 'aria-hidden': 'true' } }));
                    }

                    cell.appendChild(el('span', { className: 'sr-only', text: enabled ? t('intro.yes') : t('intro.no') }));

                    row.appendChild(cell);
                });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        target.appendChild(table);

        if (ids.length > 8) {
            var readMore = el('p', { className: 'read-more' });
            var readMoreButton = el('button', {
                className: 'button',
                text: t('intro.showAllVersions'),
                attrs: {
                    type: 'button',
                    'aria-expanded': 'false',
                    'aria-controls': 'versionHistoryTable'
                }
            });

            readMoreButton.addEventListener(
                'click',
                function () {
                    var firstHiddenLink = target.querySelector('tbody tr[aria-hidden="true"] a');

                    target.dataset.expanded = 'true';

                    readMoreButton.setAttribute('aria-expanded', 'true');

                    target.querySelectorAll('tbody tr[aria-hidden="true"]').forEach(function (row) {
                        row.removeAttribute('aria-hidden');

                        row.querySelectorAll('a, button').forEach(function (control) {
                            control.removeAttribute('tabindex');
                        });
                    });

                    target.style.height = 'auto';
                    target.style.maxHeight = 'none';
                    target.style.overflow = 'visible';

                    var panel = target.closest('.panel');

                    if (panel) {
                        panel.style.height = 'auto';
                        panel.style.maxHeight = 'none';
                    }

                    readMore.hidden = true;

                    if (firstHiddenLink) {
                        firstHiddenLink.focus();
                    }
                }
            );

            readMore.appendChild(readMoreButton);
            target.appendChild(readMore);
        }

        ids.forEach(function (versionId) {
            target.appendChild(renderVersionModal(intro, versionId, lang));
        });

        initializeBootstrapTooltips(target);
    }

    function renderVersionSelector(target, intro, options) {
        target = resolveElement(target);
        if (!target) return;

        options = options || {};

        var lang = options.lang || getLang();
        var selectedVersionId = options.versionId || currentVersionId(intro, options);
        var ids = versionIds(intro);

        if (!ids.length) {
            target.innerHTML = '';
            return;
        }

        var wrapper = el('div', {
            className: 'form-inline mig-version-selector'
        });

        var label = el('label', {
            className: 'control-label',
            text: t('intro.version'),
            attrs: {
                for: 'migVersionSelect'
            }
        });

        var select = el('select', {
            className: 'form-control',
            attrs: {
                id: 'migVersionSelect'
            }
        });

        ids.slice().reverse().forEach(function (versionId) {
            var info = versionInfo(intro, versionId);
            var date = formatDisplayDate(info.releaseDate, lang);

            var option = el('option', {
                text: [versionId, date].filter(Boolean).join(' '),
                attrs: {
                    value: versionId
                }
            });

            if (versionId === selectedVersionId) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        select.addEventListener('change', function () {
            var versionId = select.value;
            var parameterName = options.queryParameter || 'version';

            try {
                sessionStorage.setItem(storageKey(), versionId);
            } catch (error) {
                // Ignore storage errors. The URL parameter below is still enough.
            }

            var url = new URL(window.location.href);
            url.searchParams.set(parameterName, versionId);
            window.location.href = url.toString();
        });

        var selectWrapper = el('span', {
            className: 'mig-select-wrapper'
        });

        selectWrapper.appendChild(select);
        selectWrapper.appendChild(el('span'));

        wrapper.appendChild(label);
        wrapper.appendChild(document.createTextNode(' '));
        wrapper.appendChild(selectWrapper);

        target.innerHTML = '';
        target.appendChild(wrapper);
    }

    function getLocalizedErrors(intro, lang) {
        if (!intro || !intro.Errors) return [];
        var errors = intro.Errors;
        if (Array.isArray(errors)) {
            return errors.map(function (item) { return localized(item, lang, ''); }).filter(Boolean);
        }
        if (Array.isArray(errors[lang])) return errors[lang].filter(Boolean);
        return [];
    }

    function renderErrors(target, intro, options) {
        target = resolveElement(target);
        if (!target) return;
        options = options || {};
        var lang = options.lang || getLang();
        var errors = getLocalizedErrors(intro, lang);
        target.innerHTML = '';
        var p = el('p');
        if (!errors.length) {
            p.textContent = t('intro.noKnownErrors');
        } else {
            errors.forEach(function (error, index) {
                if (index) p.appendChild(el('br'));
                p.appendChild(document.createTextNode(error));
            });
        }
        target.appendChild(p);
    }

    function appendOnce(parent, className, text) {
        if (!parent) return;
        var old = parent.querySelector('.' + className);
        if (old) old.remove();
        var span = el('span', { className: className, text: text });
        parent.appendChild(span);
    }

    function applyHeaderInfo(intro, options) {
        options = options || {};
        var lang = options.lang || getLang();
        var latest = options.versionId || currentVersionId(intro, options);
        var system = systemName(intro, lang);
        var date = getVersionDate(intro, latest, lang);
        var headerText = [system, latest, date].filter(Boolean).join(' ');

        var navbar = document.querySelector('.main-navbar');
        if (navbar && headerText) appendOnce(navbar, 'mig-header-info', ' ' + headerText);

        var pageHeader = document.querySelector('.pageheader');
        if (pageHeader && system) appendOnce(pageHeader, 'mig-pageheader-system', system);

        if (options.updateDocumentTitle !== false) {
            applySeoMetadata(intro, { lang: lang });
        }
    }

    function initializeBootstrapTooltips(root) {
        root = root || document;

        function tryInitialize() {
            if (window.jQuery && typeof window.jQuery.fn.tooltip === 'function') {
                var $tips = window.jQuery(root).find('[data-toggle="tooltip"]');

                // Reinitialise safely. Bootstrap 3 uses "destroy"; Bootstrap 4 uses
                // "dispose". Ignore failures so this remains tolerant of either one.
                try { $tips.tooltip('destroy'); } catch (ignoreDestroy) {
                    try { $tips.tooltip('dispose'); } catch (ignoreDispose) { }
                }

                $tips.tooltip({
                    container: 'body',
                    html: true,
                    trigger: 'hover focus'
                });
                return;
            }
        }

        tryInitialize();
    }

    function initializePrintButtons() {
        if (initializePrintButtons.done) return;

        initializePrintButtons.done = true;

        document.addEventListener(
            'click',
            function (event) {
                var button = event.target.closest && event.target.closest('.printButton');

                if (!button) return;

                var modal = button.closest('.modal');

                if (!modal) return;

                var title = modal.querySelector('.modal-title');
                var modalBody = modal.querySelector('.modal-body');

                if (!modalBody) return;

                var printContainer = document.createElement('div');

                printContainer.className = 'mig-version-print';

                if (title) {
                    var printTitle = document.createElement('h1');

                    printTitle.textContent = title.textContent.trim();

                    printContainer.appendChild(printTitle);
                }

                var bodyClone = modalBody.cloneNode(true);

                bodyClone.classList.remove('modal-body');
                bodyClone.classList.add('mig-version-print-body');

                printContainer.appendChild(bodyClone);

                document.body.appendChild(printContainer);
                document.body.classList.add('mig-printing');

                window.print();

                document.body.classList.remove('mig-printing');

                printContainer.remove();

                // Close the modal after printing.
                if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.modal === 'function') {
                    window.jQuery(modal).modal('hide');
                }
            }
        );
    }

    function renderCurrentVersionChanges(target, intro, options) {
        options = options || {};
        var lang = options.lang || getLang();
        var versionId = options.versionId || currentVersionId(intro, options);

        target = resolveElement(target);
        if (!target) return;

        renderChangeList(target, getVersionChanges(intro, versionId, lang), { lang: lang });
        initializeBootstrapTooltips(target);
    }

    function renderSchemaDownloads(target, intro, options) {
        target = resolveElement(target);
        if (!target) return;

        options = options || {};
        var lang = options.lang || getLang();
        var ids = versionIds(intro);

        var schemaVersionIds = ids.filter(function (versionId) {
            return isTruthyFlag(versionInfo(intro, versionId).xml);
        });

        target.innerHTML = '';

        if (!schemaVersionIds.length) {
            target.appendChild(el('p', {
                text: t('intro.noSchemaDownloads')
            }));
            return;
        }

        var list = el('ul', { className: 'list-unstyled' });

        schemaVersionIds.slice().reverse().forEach(function (versionId) {
            var info = versionInfo(intro, versionId);
            var date = formatDisplayDate(info.releaseDate, lang);
            var remark = localized(info.remark, lang, '');

            var item = el('li');

            var link = el('a', {
                attrs: { href: '../common/' + encodeURIComponent(versionId) + '/schemas.zip' }
            });

            link.appendChild(el('span', {
                className: 'icon icon-tulli-file-import',
                attrs: { 'aria-hidden': 'true' }
            }));

            link.appendChild(document.createTextNode(
                [
                    ' ',
                    t('intro.version'),
                    versionId,
                    date
                ].filter(Boolean).join(' ')
            ));

            item.appendChild(link);

            if (remark) {
                item.appendChild(document.createTextNode(' — ' + remark));
            }

            list.appendChild(item);
        });

        target.appendChild(list);
    }

    function renderSystemIntro(target, intro, options) {
        target = resolveElement(target);
        if (!target) return;

        options = options || {};

        var lang = options.lang || getLang();
        var versionId = options.versionId || currentVersionId(intro, options);
        var usecasesUrl = '../common/' + encodeURIComponent(versionId) + '/usecases.json';

        var titleTarget = resolveElement(options.titleTarget);
        if (titleTarget) {
            titleTarget.textContent = systemName(intro, lang);
        }

        target.innerHTML = '';

        loadJson(usecasesUrl).then(function (usecases) {
            var markdown = usecases &&
                usecases.intro &&
                (usecases.intro[lang] || usecases.intro.en || '');

            if (!markdown) return;

            if (window.marked && typeof window.marked.parse === 'function') {
                target.innerHTML = window.marked.parse(
                    markdown,
                    {
                        breaks: true
                    }
                );
            } else {
                // Very small fallback: paragraphs only.
                markdown.split(/\n{2,}/).forEach(function (paragraph) {
                    target.appendChild(el('p', { text: paragraph.trim() }));
                });
            }
        }).catch(function (error) {
            console.warn('Could not load usecases intro:', error);
        });
    }

    function getMessages(intro, versionId) {
        return (versionInfo(intro, versionId || currentVersionId(intro)).messages || []).slice();
    }

    function getExamples(intro, versionId) {
        return (versionInfo(intro, versionId || currentVersionId(intro)).examples || []).slice();
    }

    function initIndex(options) {
        options = options || {};
        var lang = options.lang || getLang();
        return loadIntro(options.introUrl).then(function (intro) {
            var versionId = resolveActiveVersion(intro, options);

            applyHeaderInfo(intro, { lang: lang, updateDocumentTitle: options.updateDocumentTitle });
            renderVersionHistory(options.historyTarget || '#history', intro, { lang: lang });
            renderSystemIntro('#systemIntro', intro, { lang: lang, titleTarget: '#systemIntroTitle' });
            renderCurrentVersionChanges(options.notesTarget || '#notes', intro, { lang: lang });
            renderErrors(options.errorsTarget || '#errors', intro, { lang: lang });
            renderSchemaDownloads('#schemaDownloads', intro, { lang: lang });
            updateVersionLinks(versionId, options);
            initializePrintButtons();
            return intro;
        });
    }

    function initPage(options) {
        options = options || {};
        var lang = options.lang || getLang();

        return loadIntro(options.introUrl).then(function (intro) {
            var versionId = resolveActiveVersion(intro, options);

            applyHeaderInfo(intro, {
                lang: lang,
                versionId: versionId,
                updateDocumentTitle: options.updateDocumentTitle
            });

            renderVersionSelector(options.versionSelectorTarget, intro, {
                lang: lang,
                versionId: versionId,
                queryParameter: options.queryParameter
            });

            updateVersionLinks(versionId, options);

            return intro;
        });
    }

    window.MIGIntro = {
        loadJson: loadJson,
        commonBaseUrl: commonBaseUrl,
        versionedCommonUrl: versionedCommonUrl,
        loadIntro: loadIntro,
        defaultIntroUrl: defaultIntroUrl,
        getLang: getLang,
        getSystemPath: getSystemPath,
        storageKey: storageKey,
        versionIds: versionIds,
        latestManifestVersionId: latestManifestVersionId,
        currentVersionId: currentVersionId,
        latestVersionId: latestVersionId,
        versionInfo: versionInfo,
        updateVersionLinks: updateVersionLinks,
        systemName: systemName,
        resolveActiveVersion: resolveActiveVersion,
        setActiveVersion: setActiveVersion,
        getVersionChanges: getVersionChanges,
        getMessages: getMessages,
        getExamples: getExamples,
        renderVersionHistory: renderVersionHistory,
        renderCurrentVersionChanges: renderCurrentVersionChanges,
        renderErrors: renderErrors,
        renderVersionSelector: renderVersionSelector,
        applyHeaderInfo: applyHeaderInfo,
        applySeoMetadata: applySeoMetadata,
        refreshTooltips: initializeBootstrapTooltips,
        initIndex: initIndex,
        initPage: initPage,
        richTextToHtml: richTextToHtml
    };
}());

function isIntroIndexPage() {
    return !!(
        document.querySelector('#history') &&
        document.querySelector('#notes') &&
        document.querySelector('#errors')
    );
}

function autoInitIntro() {
    if (document.documentElement.dataset.migIntroAutoInitialized === 'true') return;
    document.documentElement.dataset.migIntroAutoInitialized = 'true';

    if (isIntroIndexPage()) {
        MIGIntro.initIndex({
            introUrl: MIGIntro.defaultIntroUrl(),
            historyTarget: '#history',
            notesTarget: '#notes',
            errorsTarget: '#errors'
        });
        return;
    }

    MIGIntro.initPage({
        introUrl: MIGIntro.defaultIntroUrl(),
        versionSelectorTarget: '#migVersionSelector'
    });
}

window.MIG_I18N.ready(autoInitIntro);
