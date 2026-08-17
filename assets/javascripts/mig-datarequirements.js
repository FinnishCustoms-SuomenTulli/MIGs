(function () {
    'use strict';

    var t = window.MIGUtils.t;
    var el = window.MIGUtils.el;
    var localized = window.MIGUtils.localized;
    var safeId = window.MIGUtils.safeId;
    var renderEmptyState = window.MIGUtils.renderEmptyState;
    var initScrollableTabs = window.MIGUtils.initScrollableTabs;
    var selectedSubset = '';
    var referenceModalTrigger = null;
    var announceStatus = window.MIGUtils.announceStatus;

    function dataRequirementsViewStorageKey() {
        return 'mig:' + MIGIntro.getSystemPath() + ':dataRequirementsViewMode';
    }

    function getDataRequirementsViewMode() {
        var value = null;

        try {
            value = localStorage.getItem(dataRequirementsViewStorageKey());
        } catch (ignore) { }

        return value === 'table' ? 'table' : 'split';
    }

    function setDataRequirementsViewMode(value) {
        value = value === 'table' ? 'table' : 'split';

        try {
            localStorage.setItem(dataRequirementsViewStorageKey(), value);
        } catch (ignore) { }

        return value;
    }

    function messageTabId(messageId) {
        return 'message_' + safeId(messageId);
    }

    function messageTabControlId(messageId) {
        return 'message_tab_' + safeId(messageId);
    }

    function activeMessageIndex(messages) {
        var hash = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));

        if (!hash) return 0;

        var index = messages.findIndex(function (message) {
            return hash === messageTabId(message.id) ||
                hash === safeId(message.id) ||
                hash === message.id;
        });

        return index === -1 ? 0 : index;
    }

    function syncMessageTabState(tabs, activeTab) {
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

    function handleMessageTabKeydown(event, tabs) {
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

                if (window.jQuery) {
                    window.jQuery(currentTab).tab('show');
                } else {
                    currentTab.click();
                }

                return;

            default:
                return;
        }

        event.preventDefault();

        tabLinks[targetIndex].focus();
    }

    function indexUsecaseMessages(usecases) {
        var index = {};

        ((usecases && usecases.messages) || []).forEach(function (message) {
            if (message && message.id) {
                index[message.id] = message;
            }
        });

        return index;
    }

    function normalizeMessage(message, lang, usecaseMessageIndex) {
        var id = '';

        if (typeof message === 'string') {
            id = message;
        } else if (message) {
            id = message.id || message.messageId || message.message || message.name || '';
        }

        if (!id) return null;

        var usecaseMessage = usecaseMessageIndex[id] || {};

        return {
            id: id,
            tabLabel: id,
            title: localized(usecaseMessage.name, lang) || id,
            sender: usecaseMessage.sender || '',
            description: localized(usecaseMessage.description, lang)
        };
    }

    function messageIconClass(message) {
        return message.sender === 'EO'
            ? 'icon icon-tulli-file-export'
            : 'icon icon-tulli-file-import';
    }

    function applyDataRequirementsViewMode(mode) {
        mode = mode === 'table' ? 'table' : 'split';

        document.body.classList.toggle('datarequirements-view-table', mode === 'table');
        document.body.classList.toggle('datarequirements-view-split', mode === 'split');
    }

    function renderViewModeControl(target) {
        target = document.querySelector(target || '#dataRequirementsViewMode');
        if (!target) return;

        var currentMode = getDataRequirementsViewMode();

        target.innerHTML = '';

        var wrapper = el('div', {
            className: 'dropdown mig-view-mode-dropdown'
        });

        var button = el('button', {
            className: 'mig-view-mode-button dropdown-toggle',
            attrs: {
                type: 'button',
                id: 'dataRequirementsViewModeButton',
                'data-toggle': 'dropdown',
                'aria-expanded': 'false',
                'aria-controls': 'dataRequirementsViewModeMenu',
                'aria-label': t('dataRequirements.viewMode.title'),
                title: t('dataRequirements.viewMode.title')
            }
        });

        button.appendChild(el('span', {
            className: 'icon icon-tulli-settings',
            attrs: {
                'aria-hidden': 'true'
            }
        }));

        var menu = el('ul', {
            className: 'dropdown-menu dropdown-menu-right',
            attrs: {
                id: 'dataRequirementsViewModeMenu',
                'aria-labelledby': 'dataRequirementsViewModeButton'
            }
        });

        menu.appendChild(renderViewModeOption(
            'split',
            t('dataRequirements.viewMode.split'),
            currentMode
        ));

        menu.appendChild(renderViewModeOption(
            'table',
            t('dataRequirements.viewMode.table'),
            currentMode
        ));

        wrapper.appendChild(button);
        wrapper.appendChild(menu);
        target.appendChild(wrapper);
    }

    function renderViewModeOption(value, label, currentMode) {
        var item = el('li');

        var isSelected =
            value === currentMode;

        var button = el('button', {
            className: 'mig-view-mode-option',
            attrs: {
                type: 'button',
                'data-view-mode': value,
                'aria-pressed':
                    isSelected ? 'true' : 'false'
            }
        });

        button.appendChild(el('span', {
            className: isSelected
                ? 'icon icon-tulli-radio-checked'
                : 'icon icon-tulli-radio-unchecked',
            attrs: {
                'aria-hidden': 'true'
            }
        }));

        button.appendChild(
            document.createTextNode(
                ' ' + label
            )
        );

        button.addEventListener(
            'click',
            function () {
                var selectedMode =
                    setDataRequirementsViewMode(
                        value
                    );

                applyDataRequirementsViewMode(
                    selectedMode
                );

                rerenderActiveMessage();

                announceStatus(
                    t('dataRequirements.updated')
                );

                renderViewModeControl(
                    '#dataRequirementsViewMode'
                );

                var trigger =
                    document.getElementById(
                        'dataRequirementsViewModeButton'
                    );

                if (trigger) {
                    trigger.focus();
                }
            }
        );

        item.appendChild(button);

        return item;
    }

    function renderSubsetFilter(target, intro, lang) {
        target = document.querySelector(
            target || '#migSubsetFilter'
        );

        if (!target) {
            return;
        }

        target.innerHTML = '';

        var filters =
            intro &&
                intro.Filters &&
                typeof intro.Filters === 'object'
                ? intro.Filters
                : null;

        if (!filters || !Object.keys(filters).length) {
            selectedSubset = '';
            return;
        }

        var container = el('div', {
            className: 'form-inline mig-version-selector'
        });

        var label = el('label', {
            className: 'control-label',
            text: t('dataRequirements.subset'),
            attrs: {
                for: 'mig-subset-select'
            }
        });

        var selectWrapper = el('span', {
            className: 'mig-select-wrapper'
        });

        var select = el('select', {
            className: 'form-control',
            attrs: {
                id: 'mig-subset-select'
            }
        });

        select.appendChild(el('option', {
            text: t('dataRequirements.showAll'),
            attrs: {
                value: ''
            }
        }));

        Object.keys(filters).forEach(function (filterKey) {
            select.appendChild(el('option', {
                text: localized(
                    filters[filterKey],
                    lang
                ) || filterKey,
                attrs: {
                    value: filterKey
                }
            }));
        });

        select.value = selectedSubset;

        select.addEventListener('change', function () {
            selectedSubset = select.value;

            rerenderActiveMessage();

            announceStatus(
                t('dataRequirements.updated')
            );
        });

        selectWrapper.appendChild(select);
        selectWrapper.appendChild(el('span'));

        container.appendChild(label);
        container.appendChild(
            document.createTextNode(' ')
        );
        container.appendChild(selectWrapper);

        target.appendChild(container);
    }

    function renderMessageHeader(target, message) {
        target.innerHTML = '';

        var title = el('h2', {
            className: 'panel-title'
        });

        title.appendChild(el('span', {
            className: 'icon icon-tulli-message icon-white',
            attrs: {
                style: 'margin-right:3px',
                'aria-hidden': 'true'
            }
        }));

        title.appendChild(document.createTextNode(
            message.id + (message.title && message.title !== message.id ? ' - ' + message.title : '')
        ));

        target.appendChild(title);
    }

    function renderMessageIntoPane(message, pane, options) {
        if (pane.dataset.loaded === 'true') return;

        pane.dataset.loaded = 'true';

        var headerTarget = pane.querySelector('[data-message-header]');
        var contentTarget = pane.querySelector('[data-message-content]');
        var declarationRoot = options.declarationRoot || document.body.getAttribute('data-declaration-root') || '';

        if (!headerTarget || !contentTarget) return;

        renderMessageHeader(headerTarget, message);

        MIGDataRequirementsRenderer.loadMessage(
            options.dataRequirementsUrl,
            contentTarget,
            {
                lang: options.lang,
                message: message,
                messageId: message.id,
                declarationRoot: declarationRoot,
                viewMode: getDataRequirementsViewMode(),
                subset: options.subset
            }
        ).catch(function (error) {
            pane.dataset.loaded = 'false';
            contentTarget.textContent = error.message || String(error);
            console.warn(error);
        });
    }

    function rerenderActiveMessage() {
        var activePane = document.querySelector('#messageTabContent .tab-pane.active');

        if (!activePane || typeof activePane.renderMessage !== 'function') return;

        var contentTarget = activePane.querySelector('[data-message-content]');

        activePane.dataset.loaded = 'false';

        if (contentTarget) {
            contentTarget.innerHTML = '';
        }

        activePane.renderMessage();
    }

    function findReferenceTrigger(node, root) {
        while (node && node !== root) {
            if (
                node.nodeType === 1 &&
                node.hasAttribute('data-reference-type') &&
                node.hasAttribute('data-reference-id')
            ) {
                return node;
            }

            node = node.parentNode;
        }

        return null;
    }

    function openReferenceModal(type, id, options) {
        options = options || {};

        var modal = document.getElementById('dataRequirementsModal');
        var title = document.getElementById('dataRequirementsModalTitle');
        var body = document.getElementById('dataRequirementsModalBody');

        if (!modal || !title || !body) return;

        title.textContent = id;
        body.innerHTML = '';

        if (type === 'code-list') {
            MIGCodeListRenderer.loadCodeList(
                options.codeListsUrl,
                body,
                {
                    codeListId: id,
                    lang: options.lang,
                    date: options.codeListDate,
                    pageSize: 100,
                    fitToModal: true
                }
            ).then(function (codeList) {
                if (codeList) {
                    title.textContent =
                        codeList.id + ' - ' + codeList.name;
                }
            }).catch(function (error) {
                body.textContent = error.message || String(error);
                console.warn(error);
            });
        } else if (type === 'constraint') {
            MIGConstraintRenderer.loadConstraint(
                options.constraintsUrl,
                body,
                {
                    constraintId: id,
                    lang: options.lang
                }
            ).then(function (constraint) {
                if (!constraint) {
                    return null;
                }

                title.textContent = constraint.id;

                return MIGCodeListRenderer.loadCodeItem(
                    options.codeListsUrl,
                    body,
                    {
                        codeListId: 'CL401',
                        code: constraint.id,
                        lang: options.lang,
                        date: options.codeListDate,
                        silent: true,
                        className:
                            'data-requirements-constraint-code-description'
                    }
                );
            }).catch(function (error) {
                body.textContent =
                    error.message || String(error);

                console.warn(error);
            });
        }

        if (window.jQuery) {
            window.jQuery(modal).modal('show');
        }
    }

    function resetReferenceModal() {
        var title = document.getElementById('dataRequirementsModalTitle');
        var body = document.getElementById('dataRequirementsModalBody');

        if (title) title.textContent = '';
        if (body) body.innerHTML = '';
    }

    function initializeReferenceModal(root, options) {
        if (!root || root.dataset.referenceModalBound === 'true') return;

        root.dataset.referenceModalBound = 'true';

        root.addEventListener('click', function (event) {
            var trigger = findReferenceTrigger(event.target, root);

            if (!trigger) return;

            event.preventDefault();

            var type = trigger.getAttribute('data-reference-type');
            var id = trigger.getAttribute('data-reference-id');

            referenceModalTrigger = trigger;
            openReferenceModal(type, id, options);
        });

        if (window.jQuery) {
            window.jQuery('#dataRequirementsModal')
                .on('shown.bs.modal', function () {
                    var closeButton =
                        document.getElementById(
                            'dataRequirementsModalClose'
                        );

                    if (closeButton) {
                        closeButton.focus();
                    }
                })
                .on('hidden.bs.modal', function () {
                    resetReferenceModal();

                    if (
                        referenceModalTrigger &&
                        document.documentElement.contains(
                            referenceModalTrigger
                        )
                    ) {
                        referenceModalTrigger.focus();
                    }

                    referenceModalTrigger = null;
                });
        }
    }

    function initDataRequirementsPage(options) {
        options = options || {};

        var tabs = document.querySelector(options.tabsTarget || '#messageTabs');
        var tabContent = document.querySelector(options.contentTarget || '#messageTabContent');
        var viewMode = getDataRequirementsViewMode();

        applyDataRequirementsViewMode(viewMode);
        renderViewModeControl('#dataRequirementsViewMode');

        if (!tabs || !tabContent) return;
        if (!window.MIGIntro) return;

        var lang = options.lang || MIGIntro.getLang();
        var introUrl = options.introUrl || MIGIntro.defaultIntroUrl();

        return MIGIntro.loadIntro(introUrl).then(function (intro) {
            var versionId =
                options.versionId ||
                MIGIntro.resolveActiveVersion(intro, options);

            var usecasesUrl = MIGIntro.versionedCommonUrl(
                versionId,
                'usecases.json',
                introUrl
            );

            var constraintsUrl = MIGIntro.versionedCommonUrl(
                versionId,
                'constraints.json',
                introUrl
            );

            renderSubsetFilter(
                '#migSubsetFilter',
                intro,
                lang
            );

            initializeReferenceModal(tabContent, {
                lang: lang,
                codeListsUrl:
                    options.codeListsUrl ||
                    document.body.getAttribute(
                        'data-codelists-url'
                    ) ||
                    '../../../../codelists/codelists.json',
                constraintsUrl: constraintsUrl,
                codeListDate: options.codeListDate
            });

            return MIGIntro.loadJson(usecasesUrl).then(function (usecases) {
                var introMessages = MIGIntro.getMessages(intro, versionId) || [];
                var usecaseMessageIndex = indexUsecaseMessages(usecases);

                function rawMessageId(rawMessage) {
                    return typeof rawMessage === 'string'
                        ? rawMessage
                        : rawMessage && rawMessage.id;
                }

                var messages = introMessages.filter(function (rawMessage) {
                    var id = rawMessageId(rawMessage);

                    return id && usecaseMessageIndex[id];
                });

                tabs.innerHTML = '';
                tabContent.innerHTML = '';

                if (!messages.length) {
                    renderEmptyState(tabContent, 'dataRequirements.noMessages');

                    console.warn('No messages found for version:', versionId, {
                        versionInfo: MIGIntro.versionInfo(intro, versionId)
                    });

                    return;
                }

                var normalizedMessages = messages
                    .map(function (rawMessage) {
                        return normalizeMessage(rawMessage, lang, usecaseMessageIndex);
                    })
                    .filter(Boolean);

                if (!normalizedMessages.length) {
                    renderEmptyState(tabContent, 'dataRequirements.noMessages');
                    return;
                }

                var selectedIndex = activeMessageIndex(normalizedMessages);

                var dataRequirementsUrl = MIGIntro.versionedCommonUrl(versionId, 'data.json', introUrl);

                normalizedMessages.forEach(function (message, index) {
                    var tabId = messageTabId(message.id);
                    var tabControlId = messageTabControlId(message.id);

                    var isActive = index === selectedIndex;

                    var tabItem = el('li', {
                        className: isActive ? 'active' : ''
                    });

                    var tabLink = el('a', {
                        className: isActive ? 'active' : '',
                        attrs: {
                            id: tabControlId,
                            href: '#' + tabId,
                            role: 'tab',
                            'data-toggle': 'tab',
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
                        className:
                            messageIconClass(message),
                        attrs: {
                            'aria-hidden': 'true'
                        }
                    }));

                    tabLink.appendChild(document.createTextNode(message.tabLabel));

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

                    var panel = el('div', {
                        className: 'panel panel-primary'
                    });

                    var panelHeading = el('div', {
                        className: 'panel-heading',
                        attrs: {
                            'data-message-header':
                                message.id
                        }
                    });

                    panel.appendChild(panelHeading);

                    var content = el('div', {
                        attrs: {
                            id: 'contents' + safeId(message.id),
                            'data-message-content': message.id
                        }
                    });

                    pane.appendChild(panel);
                    pane.appendChild(content);

                    tabItem.appendChild(tabLink);
                    tabs.appendChild(tabItem);
                    tabContent.appendChild(pane);

                    tabLink.addEventListener(
                        'keydown',
                        function (event) {
                            handleMessageTabKeydown(
                                event,
                                tabs
                            );
                        }
                    );

                    function loadThisMessage() {
                        renderMessageIntoPane(message, pane, {
                            lang: lang,
                            versionId: versionId,
                            dataRequirementsUrl: dataRequirementsUrl,
                            subset: selectedSubset
                        });
                    }

                    pane.renderMessage = loadThisMessage;

                    if (window.jQuery) {
                        syncMessageTabState(
                            tabs,
                            tabLink
                        );

                        window.jQuery(tabLink).on('shown.bs.tab', function () {
                            if (window.history && window.history.replaceState) {
                                window.history.replaceState(null, '', '#' + tabId);
                            }

                            loadThisMessage();
                            window.MIG_I18N.updateLanguageLinks();
                        });
                    } else {
                        tabLink.addEventListener('click', function () {
                            if (window.history && window.history.replaceState) {
                                window.history.replaceState(null, '', '#' + tabId);
                            }

                            loadThisMessage();
                            window.MIG_I18N.updateLanguageLinks();
                        });
                    }

                    if (isActive) {
                        loadThisMessage();
                    }
                });

                initScrollableTabs();
            });
        });
    }

    function autoInitDataRequirementsPage() {
        if (!document.querySelector('#messageTabs')) return;
        if (!document.querySelector('#messageTabContent')) return;

        initDataRequirementsPage();
    }

    window.MIG_I18N.ready(autoInitDataRequirementsPage);

    window.MIGDataRequirements = {
        init: initDataRequirementsPage
    };
}());