(function () {
    'use strict';

    var t = window.MIGUtils.t;
    var el = window.MIGUtils.el;
    var localized = window.MIGUtils.localized;
    var safeId = window.MIGUtils.safeId;
    var renderEmptyState = window.MIGUtils.renderEmptyState;
    var initScrollableTabs = window.MIGUtils.initScrollableTabs;
    var renderErrorAlert = window.MIGUtils.renderErrorAlert;

    function exampleTabId(exampleId) {
        return 'example_' + safeId(exampleId);
    }

    function exampleTabControlId(exampleId) {
        return 'example_tab_' + safeId(exampleId);
    }

    function activeExampleIndex(examples) {
        var hash = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));

        if (!hash) return 0;

        var index = examples.findIndex(function (example) {
            return hash === exampleTabId(example.id) ||
                hash === safeId(example.id) ||
                hash === example.id;
        });

        return index === -1 ? 0 : index;
    }

    function syncExampleTabState(tabs, activeTab) {
        tabs.querySelectorAll('[role="tab"]').forEach(function (tab) {
            var isActive = tab === activeTab;

            tab.setAttribute(
                'aria-selected',
                isActive ? 'true' : 'false'
            );

            tab.setAttribute(
                'tabindex',
                isActive ? '0' : '-1'
            );
        });
    }

    function handleExampleTabKeydown(event, tabs) {
        var currentTab = event.currentTarget;

        var tabLinks =
            Array.prototype.slice.call(
                tabs.querySelectorAll('[role="tab"]')
            );

        var currentIndex =
            tabLinks.indexOf(currentTab);

        if (currentIndex === -1) {
            return;
        }

        var targetIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
                targetIndex =
                    currentIndex === 0
                        ? tabLinks.length - 1
                        : currentIndex - 1;
                break;

            case 'ArrowRight':
                targetIndex =
                    currentIndex === tabLinks.length - 1
                        ? 0
                        : currentIndex + 1;
                break;

            case 'Home':
                targetIndex = 0;
                break;

            case 'End':
                targetIndex =
                    tabLinks.length - 1;
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();

                if (window.bootstrap && window.bootstrap.Tab) window.bootstrap.Tab.getOrCreateInstance(currentTab).show();
                else currentTab.click();

                return;

            default:
                return;
        }

        event.preventDefault();

        var targetTab =
            tabLinks[targetIndex];

        targetTab.focus();

        if (
            typeof targetTab.scrollIntoView === 'function'
        ) {
            targetTab.scrollIntoView({
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    function normalizeExample(example, lang) {
        var id = '';
        var file = '';
        var label = '';

        if (typeof example === 'string') {
            id = example.replace(/\.xml$/i, '');
            file = example;
            label = id;
        } else if (example) {
            id = example.id || example.message || example.name || example.file || '';
            file = example.file || id;
            label = localized(example.label || example.name, lang, '') || id;
        }

        if (!id) return null;

        if (!/\.xml$/i.test(file)) {
            file += '.xml';
        }

        return {
            id: id.replace(/\.xml$/i, ''),
            file: file,
            label: label || id
        };
    }

    function initExamplesPage(options) {
        options = options || {};

        var tabs = document.querySelector(options.tabsTarget || '#exampleTabs');
        var tabContent = document.querySelector(options.contentTarget || '#exampleTabContent');

        if (!tabs || !tabContent) return;
        if (!window.MIGIntro || !window.MIGExampleRenderer) return;

        var lang = options.lang || MIGIntro.getLang();
        var introUrl = options.introUrl || MIGIntro.defaultIntroUrl();

        return MIGIntro.loadIntro(introUrl).then(function (intro) {
            var versionId = options.versionId || MIGIntro.resolveActiveVersion(intro, options);
            var examples = MIGIntro.getExamples(intro, versionId);

            tabs.innerHTML = '';
            tabContent.innerHTML = '';

            if (!examples || !examples.length) {
                renderEmptyState(tabContent, 'examples.noExamples');

                console.warn('No examples found for version:', versionId, {
                    versionInfo: MIGIntro.versionInfo(intro, versionId)
                });

                document.body.classList.remove('page-loading');

                return;
            }

            var examplesBaseUrl = MIGIntro.versionedCommonUrl(versionId, 'examples/', introUrl);

            function loadExampleIntoPane(example, pane) {
                if (pane.dataset.loaded === 'true') return Promise.resolve();

                pane.dataset.loaded = 'true';

                return MIGExampleRenderer.loadXmlExample(
                    examplesBaseUrl + encodeURIComponent(example.file),
                    pane
                ).catch(function (error) {
                    pane.dataset.loaded = 'false';

                    renderErrorAlert(
                        pane,
                        error.message || String(error),
                        error
                    );
                });
            }

            var normalizedExamples = examples
                .map(function (rawExample) {
                    return normalizeExample(rawExample, lang);
                })
                .filter(Boolean);

            if (!normalizedExamples.length) {
                renderEmptyState(tabContent, 'examples.noExamples');

                document.body.classList.remove('page-loading');

                return;
            }

            var selectedIndex = activeExampleIndex(normalizedExamples);

            normalizedExamples.forEach(function (example, index) {
                var tabId = exampleTabId(example.id);
                var tabControlId = exampleTabControlId(example.id);

                var isActive = index === selectedIndex;

                var tabItem = el('li', {
                    className: isActive ? 'active' : '',
                    attrs: { role: 'presentation' }
                });

                var tabLink = el('a', {
                    className: isActive ? 'active' : '',
                    attrs: {
                        id: tabControlId,
                        href: '#' + tabId,
                        role: 'tab',
                        'data-bs-toggle': 'tab',
                        'aria-controls': tabId,
                        'aria-selected': isActive
                            ? 'true'
                            : 'false',
                        tabindex: isActive
                            ? '0'
                            : '-1'
                    }
                });

                tabLink.appendChild(el('span', {
                    className: 'icon icon-tulli-file-xml',
                    attrs: {
                        'aria-hidden': 'true'
                    }
                }));

                tabLink.appendChild(document.createTextNode(example.label));

                var pane = el('div', {
                    className:
                        'tab-pane' +
                        (isActive ? ' active' : ''),
                    attrs: {
                        id: tabId,
                        role: 'tabpanel',
                        'aria-labelledby':
                            tabControlId,
                        tabindex: '0'
                    }
                });

                tabItem.appendChild(tabLink);
                tabs.appendChild(tabItem);
                tabContent.appendChild(pane);

                tabLink.addEventListener(
                    'keydown',
                    function (event) {
                        handleExampleTabKeydown(
                            event,
                            tabs
                        );
                    }
                );

                if (window.bootstrap && window.bootstrap.Tab) {
                    tabLink.addEventListener('shown.bs.tab', function () {
                        syncExampleTabState(tabs, tabLink);

                        if (window.history && window.history.replaceState) {
                            window.history.replaceState(null, '', '#' + tabId);
                        }

                        loadExampleIntoPane(example, pane);
                        if (window.MIG_I18N && typeof window.MIG_I18N.updateLanguageLinks === 'function') {
                            window.MIG_I18N.updateLanguageLinks();
                        }
                    });
                } else {
                    tabLink.addEventListener('click', function () {
                        if (window.history && window.history.replaceState) {
                            window.history.replaceState(null, '', '#' + tabId);
                        }

                        loadExampleIntoPane(example, pane);
                        if (window.MIG_I18N && typeof window.MIG_I18N.updateLanguageLinks === 'function') {
                            window.MIG_I18N.updateLanguageLinks();
                        }
                    });
                }

                if (isActive) {
                    loadExampleIntoPane(example, pane).then(function () {
                        document.body.classList.remove('page-loading');
                    });
                }

            });

            initScrollableTabs();
        });
    }

    function autoInitExamplesPage() {
        if (!document.querySelector('#exampleTabs')) return;
        if (!document.querySelector('#exampleTabContent')) return;

        initExamplesPage();
    }

    window.MIG_I18N.ready(autoInitExamplesPage);

    window.MIGExamples = {
        init: initExamplesPage
    };
}());