(function (global) {
    'use strict';

    var current = null;
    var caseEventsBound = false;

    var t = global.MIGUtils.t;
    var el = global.MIGUtils.el;
    var localized = global.MIGUtils.localizedCoerce;
    var markdownToHtml = global.MIGUtils.markdownToHtml;
    var externalizeLinks = global.MIGUtils.externalizeLinks;
    var renderErrorAlert = global.MIGUtils.renderErrorAlert;

    function renderPlainText(target, value) {
        String(value || '')
            .split(/\r?\n\r?\n/)
            .forEach(function (paragraphText) {
                if (!paragraphText) {
                    return;
                }

                var paragraph = el('p');
                var lines = paragraphText.split(/\r?\n/);

                lines.forEach(function (line, index) {
                    if (index > 0) {
                        paragraph.appendChild(el('br'));
                    }

                    paragraph.appendChild(
                        document.createTextNode(line)
                    );
                });

                target.appendChild(paragraph);
            });
    }

    function renderMarkdownInto(target, value) {
        var html = markdownToHtml(value, {
            tableClass: 'table table-striped table-responsive'
        });

        target.innerHTML = '';

        if (!html) {
            renderPlainText(target, value);
            return;
        }

        target.innerHTML = html;

        externalizeLinks(target);
    }

    function safeKey(value) {
        return String(value || '')
            .trim()
            .replace(/[^A-Za-z0-9_-]+/g, '-');
    }

    function groupAnchorId(group) {
        return 'usecase-group-' + safeKey(group.key);
    }

    function subgroupAnchorId(subgroup) {
        return 'usecase-subgroup-' + safeKey(subgroup.key);
    }

    function caseCollapseId(caseNumber) {
        /*
         * Preserve the legacy CASE1 / CASE2 / ... hashes.
         */
        return 'CASE' + caseNumber;
    }

    function requestedCaseNumber() {
        var hash = decodeURIComponent(
            (global.location.hash || '')
                .replace(/^#/, '')
        );

        var match = hash.match(/^CASE(\d+)$/i);

        return match ? Number(match[1]) : null;
    }

    function renderTopLevelPanel(id, title) {
        var panel = el('section', {
            className: 'card card-primary message-exchange-section',
            attrs: {
                id: id
            }
        });

        var heading = el('div', {
            className: 'card-header'
        });

        heading.appendChild(el('h2', {
            className: 'card-title',
            text: title
        }));

        panel.appendChild(heading);

        var body = el('div', {
            className: 'card-body'
        });

        panel.appendChild(body);

        return {
            panel: panel,
            body: body
        };
    }

    function messageSectionLabel(sender, lang) {
        if (sender === 'EO') {
            return t('messageExchangePage.incomingMessages');
        }

        return t('messageExchangePage.outgoingMessages');
    }

    function renderMessageSection(messages, sender, lang) {
        var id = sender === 'EO'
            ? 'messages-incoming'
            : 'messages-outgoing';

        var section = el('section', {
            className: 'message-exchange-message-section',
            attrs: {
                id: id
            }
        });

        section.appendChild(el('h3', {
            text: messageSectionLabel(sender, lang)
        }));

        messages
            .filter(function (message) {
                return message.sender === sender;
            })
            .slice()
            .sort(function (left, right) {
                return String(left.id || '')
                    .localeCompare(String(right.id || ''));
            })
            .forEach(function (message) {
                var item = el('div', {
                    className: 'message-exchange-message'
                });

                var title = localized(
                    message.name,
                    lang,
                    message.id || ''
                );

                item.appendChild(el('h4', {
                    text: title + ' (' + message.id + ')'
                }));

                var description = el('div', {
                    className: 'message-exchange-markdown'
                });

                renderMarkdownInto(
                    description,
                    localized(message.description, lang, '')
                );

                item.appendChild(description);
                section.appendChild(item);
            });

        return section;
    }

    function renderMessagesPanel(data, lang) {
        var rendered = renderTopLevelPanel(
            'messages',
            t('messageExchangePage.messages')
        );

        rendered.body.appendChild(
            renderMessageSection(
                data.messages || [],
                'EO',
                lang
            )
        );

        rendered.body.appendChild(
            renderMessageSection(
                data.messages || [],
                'Customs',
                lang
            )
        );

        return rendered.panel;
    }

    function renderDescription(value, lang, className) {
        var text = localized(value, lang, '');

        if (!text) {
            return null;
        }

        var target = el('div', {
            className: className ||
                'message-exchange-markdown'
        });

        renderMarkdownInto(target, text);

        return target;
    }

    function renderCaseSteps(useCase, lang) {
        var steps = (useCase.steps || [])
            .filter(function (step) {
                return localized(step.text, lang, '');
            });

        if (!steps.length) {
            return null;
        }

        var list = el('ol', {
            className: 'message-exchange-case-steps'
        });

        steps.forEach(function (step) {
            var item = el('li');

            var text = el('div', {
                className: 'message-exchange-markdown'
            });

            renderMarkdownInto(
                text,
                localized(step.text, lang, '')
            );

            item.appendChild(text);
            list.appendChild(item);
        });

        return list;
    }

    function caseEventDetail(collapseElement) {
        if (!current || !collapseElement) {
            return null;
        }

        var index = Number(
            collapseElement.getAttribute(
                'data-use-case-index'
            )
        );

        if (!Number.isFinite(index)) {
            return null;
        }

        var useCase =
            (current.data.useCases || [])[index];

        if (!useCase) {
            return null;
        }

        return {
            index: index,
            caseNumber: index + 1,
            useCase: useCase,
            container: collapseElement.querySelector(
                '.message-exchange-sequence-diagram'
            )
        };
    }

    function notifyCaseEvent(collapseElement, eventName) {
        var detail = caseEventDetail(collapseElement);

        if (
            !detail ||
            typeof global.CustomEvent !== 'function'
        ) {
            return;
        }

        global.dispatchEvent(
            new CustomEvent(eventName, {
                detail: detail
            })
        );
    }

    function notifyCaseShowing(collapseElement) {
        notifyCaseEvent(
            collapseElement,
            'mig:usecase:showing'
        );
    }

    function notifyCaseShown(collapseElement) {
        notifyCaseEvent(
            collapseElement,
            'mig:usecase:shown'
        );
    }

    function renderUseCase(
        useCase,
        useCaseIndex,
        lang,
        openCaseNumber,
        headingLevel
    ) {
        var caseNumber = useCaseIndex + 1;
        var collapseId = caseCollapseId(caseNumber);
        var triggerId = 'trigger-' + collapseId;
        var isOpen = openCaseNumber === caseNumber;

        var panel = el('div', {
            className: 'card message-exchange-case'
        });

        var heading = el('div', {
            className: 'card-header'
        });

        var title = el(
            'h' + headingLevel,
            {
                className: 'card-title'
            }
        );

        var button = el('button', {
            className:
                'message-exchange-case-toggle' +
                (isOpen ? '' : ' collapsed'),
            attrs: {
                id: triggerId,
                type: 'button',
                'data-bs-toggle': 'collapse',
                'data-bs-target': '#' + collapseId,
                'aria-expanded': isOpen ? 'true' : 'false',
                'aria-controls': collapseId
            }
        });

        button.appendChild(el('span', {
            className:
                'message-exchange-case-number',
            text:
                t('messageExchangePage.caseLabel') +
                ' ' +
                caseNumber +
                ': '
        }));

        button.appendChild(
            document.createTextNode(
                localized(
                    useCase.name,
                    lang,
                    collapseId
                )
            )
        );

        title.appendChild(button);
        heading.appendChild(title);
        panel.appendChild(heading);

        var collapse = el('div', {
            className:
                'message-exchange-case-collapse collapse' +
                (isOpen ? ' show' : ''),
            attrs: {
                id: collapseId,
                'data-use-case-index': useCaseIndex
            }
        });

        var body = el('div', {
            className: 'card-body'
        });

        body.appendChild(el('div', {
            className:
                'message-exchange-sequence-diagram',
            attrs: {
                'data-use-case-index': useCaseIndex,
                'data-case-number': caseNumber,
                'aria-hidden': 'true'
            }
        }));

        var stepList = renderCaseSteps(useCase, lang);

        if (stepList) {
            body.appendChild(stepList);
        }

        collapse.appendChild(body);
        panel.appendChild(collapse);

        return panel;
    }

    function casesFor(data, groupKey, subgroupKey) {
        return (data.useCases || [])
            .map(function (useCase, index) {
                return {
                    useCase: useCase,
                    index: index
                };
            })
            .filter(function (record) {
                if (record.useCase.groupKey !== groupKey) {
                    return false;
                }

                if (subgroupKey == null) {
                    return !record.useCase.subgroupKey;
                }

                return record.useCase.subgroupKey ===
                    subgroupKey;
            });
    }

    function renderCases(records, lang, openCaseNumber, headingLevel) {
        if (!records.length) {
            return null;
        }

        var panelGroup = el('div', {
            className: 'message-exchange-cases'
        });

        records.forEach(function (record) {
            panelGroup.appendChild(renderUseCase(record.useCase, record.index, lang, openCaseNumber, headingLevel));
        });

        return panelGroup;
    }

    function renderSubgroup(
        data,
        group,
        subgroup,
        lang,
        openCaseNumber,
        headerLevel
    ) {
        var section = el('section', {
            className: 'message-exchange-subgroup',
            attrs: {
                id: subgroupAnchorId(subgroup)
            }
        });

        section.appendChild(el('h4', {
            text: localized(
                subgroup.label,
                lang,
                subgroup.key
            )
        }));

        var description = renderDescription(
            subgroup.description,
            lang,
            'message-exchange-markdown ' +
            'message-exchange-subgroup-description'
        );

        if (description) {
            section.appendChild(description);
        }

        var cases = renderCases(
            casesFor(data, group.key, subgroup.key),
            lang,
            openCaseNumber,
            headerLevel
        );

        if (cases) {
            section.appendChild(cases);
        }

        return section;
    }

    function renderGroup(
        data,
        group,
        lang,
        openCaseNumber
    ) {
        var section = el('section', {
            className: 'message-exchange-usecase-group',
            attrs: {
                id: groupAnchorId(group)
            }
        });

        section.appendChild(el('h3', {
            className: 'message-exchange-usecase-group-title',
            text: localized(
                group.label,
                lang,
                group.key
            )
        }));

        var description = renderDescription(
            group.description,
            lang,
            'message-exchange-markdown ' +
            'message-exchange-group-description'
        );

        if (description) {
            section.appendChild(description);
        }

        var directCases = renderCases(
            casesFor(data, group.key, null),
            lang,
            openCaseNumber,
            4
        );

        if (directCases) {
            section.appendChild(directCases);
        }

        (group.subgroups || [])
            .forEach(function (subgroup) {
                section.appendChild(
                    renderSubgroup(
                        data,
                        group,
                        subgroup,
                        lang,
                        openCaseNumber,
                        5
                    )
                );
            });

        return section;
    }

    function renderUseCasesPanel(data, lang) {
        var rendered = renderTopLevelPanel(
            'usecases',
            t('messageExchangePage.useCases')
        );

        var openCaseNumber =
            requestedCaseNumber() || 1;

        (data.useCaseGroups || [])
            .forEach(function (group) {
                rendered.body.appendChild(
                    renderGroup(
                        data,
                        group,
                        lang,
                        openCaseNumber
                    )
                );
            });

        return rendered.panel;
    }

    function navItem(href, label, className) {
        var item = el('li', {
            className: className || ''
        });

        item.appendChild(el('a', {
            text: label,
            attrs: {
                href: href
            }
        }));

        return item;
    }

    function renderSidebar(data, lang, target) {
        target.innerHTML = '';

        var messagesItem = navItem(
            '#messages',
            t('messageExchangePage.messages'),
            'message-exchange-nav-section'
        );

        var messageChildren = el('ul', {
            className:
                'nav message-exchange-nav-children'
        });

        messageChildren.appendChild(
            navItem(
                '#messages-incoming',
                messageSectionLabel('EO', lang)
            )
        );

        messageChildren.appendChild(
            navItem(
                '#messages-outgoing',
                messageSectionLabel('Customs', lang)
            )
        );

        messagesItem.appendChild(messageChildren);
        target.appendChild(messagesItem);

        target.appendChild(
            navItem(
                '#usecases',
                t('messageExchangePage.useCases'),
                'message-exchange-nav-section'
            )
        );

        (data.useCaseGroups || [])
            .forEach(function (group) {
                target.appendChild(
                    navItem(
                        '#' + groupAnchorId(group),
                        localized(
                            group.label,
                            lang,
                            group.key
                        ),
                        'message-exchange-nav-group'
                    )
                );

                (group.subgroups || [])
                    .forEach(function (subgroup) {
                        target.appendChild(
                            navItem(
                                '#' + subgroupAnchorId(
                                    subgroup
                                ),
                                localized(
                                    subgroup.label,
                                    lang,
                                    subgroup.key
                                ),
                                'message-exchange-nav-subgroup'
                            )
                        );
                    });
            });
    }

    function updateActiveNavigation(navTarget) {
        var links = Array.prototype.slice.call(
            navTarget.querySelectorAll('a[href^="#"]')
        );

        var candidates = links
            .map(function (link) {
                var id = decodeURIComponent(
                    link.getAttribute('href')
                        .replace(/^#/, '')
                );

                return {
                    link: link,
                    target: document.getElementById(id)
                };
            })
            .filter(function (record) {
                return record.target;
            });

        if (!candidates.length) {
            return;
        }

        var scheduled = false;

        function activate() {
            scheduled = false;

            var offset = 230;
            var currentRecord = candidates[0];

            candidates.forEach(function (record) {
                if (
                    record.target.getBoundingClientRect().top <=
                    offset
                ) {
                    currentRecord = record;
                }
            });

            links.forEach(function (link) {
                if (link.parentNode) {
                    link.parentNode.classList.remove(
                        'active'
                    );
                }

                link.removeAttribute(
                    'aria-current'
                );
            });

            if (
                currentRecord &&
                currentRecord.link.parentNode
            ) {
                currentRecord.link.parentNode
                    .classList.add('active');

                currentRecord.link.setAttribute(
                    'aria-current',
                    'location'
                );
            }
        }

        function schedule() {
            if (scheduled) {
                return;
            }

            scheduled = true;

            if (global.requestAnimationFrame) {
                global.requestAnimationFrame(activate);
            } else {
                global.setTimeout(activate, 16);
            }
        }

        global.addEventListener('scroll', schedule, {
            passive: true
        });
        global.addEventListener('resize', schedule);

        navTarget.addEventListener('click', function (event) {
            var link = event.target.closest
                ? event.target.closest('a[href^="#"]')
                : null;

            if (!link || !navTarget.contains(link)) {
                return;
            }

            links.forEach(function (candidate) {
                if (candidate.parentNode) {
                    candidate.parentNode.classList.remove(
                        'active'
                    );
                }
            });

            if (link.parentNode) {
                link.parentNode.classList.add('active');
            }
        });

        activate();
    }

    function bindCaseEvents() {
        var selector = '.message-exchange-case .message-exchange-case-collapse';

        if (!caseEventsBound) {
            document.addEventListener('show.bs.collapse', function (event) {
                if (event.target.matches(selector)) notifyCaseShowing(event.target);
            });
            document.addEventListener('shown.bs.collapse', function (event) {
                if (event.target.matches(selector)) notifyCaseShown(event.target);
            });
            caseEventsBound = true;
        }

        var initiallyOpen = document.querySelector('.message-exchange-case .message-exchange-case-collapse.show');
        if (initiallyOpen) notifyCaseShown(initiallyOpen);
    }

    function openHashCase() {
        var caseNumber = requestedCaseNumber();

        if (!caseNumber) {
            return;
        }

        var target = document.getElementById(
            caseCollapseId(caseNumber)
        );

        if (!target) {
            return;
        }

        if (global.bootstrap && global.bootstrap.Collapse) global.bootstrap.Collapse.getOrCreateInstance(target, { toggle: false }).show();

        var panel = target.closest
            ? target.closest('.message-exchange-case')
            : target;

        global.requestAnimationFrame(function () {
            panel.scrollIntoView({
                behavior: 'auto',
                block: 'start'
            });
        });
    }

    function render(data, options) {
        options = options || {};

        var contentTarget = document.querySelector(
            options.contentTarget || '#accordion'
        );

        var navTarget = document.querySelector(
            options.navTarget || '#messageExchangeNav'
        );

        if (!contentTarget) {
            return null;
        }

        var lang = options.lang ||
            (global.MIGIntro &&
                typeof global.MIGIntro.getLang === 'function'
                ? global.MIGIntro.getLang()
                : document.body.dataset.lang || 'en');

        contentTarget.innerHTML = '';

        contentTarget.appendChild(
            renderMessagesPanel(data, lang)
        );

        contentTarget.appendChild(
            renderUseCasesPanel(data, lang)
        );

        if (navTarget) {
            renderSidebar(data, lang, navTarget);
            updateActiveNavigation(navTarget);
        }

        bindCaseEvents();
        openHashCase();

        return {
            data: data,
            lang: lang
        };
    }

    function init(options) {
        options = options || {};

        var contentTarget = document.querySelector(
            options.contentTarget || '#accordion'
        );

        if (!contentTarget || !global.MIGIntro) {
            document.body.classList.remove('messageexchange-loading');

            return Promise.resolve(null);
        }

        var lang = options.lang ||
            global.MIGIntro.getLang();

        var introUrl = options.introUrl ||
            global.MIGIntro.defaultIntroUrl();

        return global.MIGIntro
            .loadIntro(introUrl)
            .then(function (intro) {
                var versionId = options.versionId ||
                    global.MIGIntro.resolveActiveVersion(
                        intro,
                        options
                    );

                global.MIGIntro.applyHeaderInfo(
                    intro,
                    {
                        lang: lang,
                        versionId: versionId,
                        updateDocumentTitle: true
                    }
                );

                var usecasesUrl = options.usecasesUrl ||
                    global.MIGIntro.versionedCommonUrl(
                        versionId,
                        'usecases.json',
                        introUrl
                    );

                return global.MIGIntro
                    .loadJson(usecasesUrl)
                    .then(function (data) {
                        current = {
                            intro: intro,
                            versionId: versionId,
                            usecasesUrl: usecasesUrl,
                            data: data,
                            lang: lang
                        };

                        render(data, {
                            lang: lang,
                            contentTarget: options.contentTarget,
                            navTarget: options.navTarget
                        });

                        document.body.classList.remove('messageexchange-loading');

                        return current;
                    });
            })
            .catch(function (error) {
                renderErrorAlert(
                    contentTarget,
                    t('messageExchangePage.loadError'),
                    error
                );

                document.body.classList.remove('messageexchange-loading');

                return null;
            });
    }

    function autoInit() {
        init();
    }

    global.MIG_I18N.ready(autoInit);

    global.MIGMessageExchange = {
        init: init,
        render: render,
        localized: localized,
        getCurrent: function () {
            return current;
        },
        getUseCase: function (index) {
            if (!current) {
                return null;
            }

            return (current.data.useCases || [])[index] ||
                null;
        }
    };
}(window));
