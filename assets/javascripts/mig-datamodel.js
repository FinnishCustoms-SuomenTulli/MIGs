(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var el = global.MIGUtils.el;
    var localized = global.MIGUtils.localizedCoerce;
    var localeForLanguage = global.MIGUtils.localeForLanguage;
    var renderErrorAlert = global.MIGUtils.renderErrorAlert;
    var selectedMessageIds = [];
    var messageTreeselect = null;

    function normalizePath(value) {
        return String(value || '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '');
    }

    function parentPath(value) {
        var path = normalizePath(value);
        var index = path.lastIndexOf('/');

        if (index === -1) {
            return null;
        }

        return path.slice(0, index);
    }

    function dotQuote(value) {
        return '"' +
            String(value || '')
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\r?\n/g, '\\n') +
            '"';
    }

    function escapeGraphvizHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function maxOccurrence(group) {
        var maximum = 1;

        Object.keys(group.messages || {})
            .forEach(function (messageId) {
                var message =
                    group.messages[messageId] || {};

                var value =
                    Number(message.maxOccurrence);

                if (
                    Number.isFinite(value) &&
                    value > maximum
                ) {
                    maximum = value;
                }
            });

        return maximum;
    }

    function classIdentity(entry, path) {
        var englishName =
            localized(
                entry.name,
                'en',
                ''
            ).trim();

        /*
         * English name is the intended class identity.
         * The path fallback only prevents unrelated unnamed
         * groups from accidentally being merged.
         */
        return englishName || normalizePath(path);
    }

    function buildModel(data, lang) {
        var entriesByPath =
            Object.create(null);

        var groupsByPath =
            Object.create(null);

        var classes =
            Object.create(null);

        var associations =
            Object.create(null);

        /*
         * First normalize every JSON path.
         */
        Object.keys(data || {}).forEach(function (
            sourcePath
        ) {
            var entry = data[sourcePath];

            if (!entry) {
                return;
            }

            var path =
                normalizePath(sourcePath);

            entriesByPath[path] = entry;

            if (entry.kind === 'Group') {
                groupsByPath[path] = entry;
            }
        });

        /*
         * Build one class for each unique English Group name.
         */
        Object.keys(groupsByPath).forEach(function (
            path
        ) {
            var group =
                groupsByPath[path];

            var identity =
                classIdentity(group, path);

            if (!classes[identity]) {
                classes[identity] = {
                    id: identity,
                    name: localized(
                        group.name,
                        lang,
                        identity
                    ),
                    elements:
                        Object.create(null)
                };
            }
        });

        /*
         * Add direct child Elements to their parent Group.
         *
         * Element identity is also based on its English name,
         * so repeated appearances inside the same class are
         * collapsed.
         */
        Object.keys(entriesByPath).forEach(function (
            path
        ) {
            var entry =
                entriesByPath[path];

            if (entry.kind !== 'Element') {
                return;
            }

            var parent =
                parentPath(path);

            var parentGroup =
                groupsByPath[parent];

            if (!parentGroup) {
                return;
            }

            var classId =
                classIdentity(
                    parentGroup,
                    parent
                );

            var targetClass =
                classes[classId];

            if (!targetClass) {
                return;
            }

            var elementId =
                localized(
                    entry.name,
                    'en',
                    path
                );

            if (
                !targetClass.elements[elementId]
            ) {
                targetClass.elements[elementId] = {
                    id: elementId,
                    name: localized(
                        entry.name,
                        lang,
                        elementId
                    )
                };
            }
        });

        /*
         * Direct Group -> Group relationships only.
         *
         * Example:
         *
         * Consignment
         *   -> Consignor
         *       -> Address
         *
         * produces exactly two associations.
         */
        Object.keys(groupsByPath).forEach(function (
            childPath
        ) {
            var child =
                groupsByPath[childPath];

            var parent =
                parentPath(childPath);

            var parentGroup =
                groupsByPath[parent];

            if (!parentGroup) {
                return;
            }

            var parentId =
                classIdentity(
                    parentGroup,
                    parent
                );

            var childId =
                classIdentity(
                    child,
                    childPath
                );

            var key =
                parentId + '\u0000' + childId;

            var occurrence =
                maxOccurrence(child);

            if (!associations[key]) {
                associations[key] = {
                    parent: parentId,
                    child: childId,
                    maxOccurrence: occurrence
                };

                return;
            }

            /*
             * Same class association may appear in several
             * source paths. Keep the largest maxOccurrence.
             */
            associations[key].maxOccurrence =
                Math.max(
                    associations[key]
                        .maxOccurrence,
                    occurrence
                );
        });

        var classList =
            Object.keys(classes)
                .map(function (id) {
                    var item =
                        classes[id];

                    item.elements =
                        Object.keys(item.elements)
                            .map(function (
                                elementId
                            ) {
                                return item.elements[
                                    elementId
                                ];
                            })
                            .sort(function (
                                left,
                                right
                            ) {
                                return left.name
                                    .localeCompare(
                                        right.name,
                                        localeForLanguage(
                                            lang
                                        ),
                                        {
                                            sensitivity:
                                                'base'
                                        }
                                    );
                            });

                    return item;
                })
                .sort(function (left, right) {
                    return left.id.localeCompare(
                        right.id,
                        'en',
                        {
                            sensitivity: 'base'
                        }
                    );
                });

        var associationList =
            Object.keys(associations)
                .map(function (key) {
                    return associations[key];
                })
                .sort(function (left, right) {
                    var parentComparison =
                        left.parent.localeCompare(
                            right.parent,
                            'en'
                        );

                    if (parentComparison !== 0) {
                        return parentComparison;
                    }

                    return left.child.localeCompare(
                        right.child,
                        'en'
                    );
                });

        return {
            classes: classList,
            associations: associationList
        };
    }

    function buildClassLabel(item) {
        var rows = [];

        rows.push(
            '<tr>' +
            '<td bgcolor="#00205B">' +
            '<font color="white">' +
            '<b>' +
            escapeGraphvizHtml(item.name) +
            '</b>' +
            '</font>' +
            '</td>' +
            '</tr>'
        );

        item.elements.forEach(function (
            element,
            index
        ) {
            var isLast =
                index === item.elements.length - 1;

            rows.push(
                '<tr>' +
                '<td ' +
                'bgcolor="#e5e8ee" ' +
                'align="left" ' +
                'sides="' +
                (
                    isLast
                        ? 'LRB'
                        : 'LR'
                ) +
                '">' +
                escapeGraphvizHtml(
                    element.name
                ) +
                '</td>' +
                '</tr>'
            );
        });

        return (
            '<<table ' +
            'border="0" ' +
            'cellspacing="0" ' +
            'cellborder="1" ' +
            'color="#E3E5E9">' +
            rows.join('') +
            '</table>>'
        );
    }

    function buildDot(model) {
        var lines = [
            'Graph ClassDiagram {',
            'bgcolor="#fafafa"',
            'ratio="0.4"',
            'node [shape=plain, fontname="Open Sans"]',
            'edge [fontname="Open Sans" width="2"]'
        ];

        model.associations.forEach(function (
            association
        ) {
            lines.push(
                dotQuote(association.parent) +
                ' -- ' +
                dotQuote(association.child) +
                ' [' +
                'headlabel=' +
                dotQuote(
                    '0..' +
                    association.maxOccurrence
                ) +
                ' ' +
                'taillabel="1" ' +
                'fontsize=10' +
                ']'
            );
        });

        model.classes.forEach(function (item) {
            lines.push(
                dotQuote(item.id) +
                ' [label=' +
                buildClassLabel(item) +
                ']'
            );
        });

        lines.push('}');

        return lines.join('\n');
    }

    function renderSvg(dot, target) {
        return global.Viz.instance()
            .then(function (viz) {
                var svg =
                    viz.renderSVGElement(dot);

                target.innerHTML = '';
                target.appendChild(svg);

                var panZoom =
                    global.svgPanZoom(
                        svg,
                        {
                            zoomEnabled: true,
                            controlIconsEnabled: true,
                            preventMouseEventsDefault:
                                false,
                            fit: true,
                            center: true
                        }
                    );

                global.jQuery(global)
                    .off('resize.datamodel')
                    .on(
                        'resize.datamodel',
                        function () {
                            panZoom.resize();
                        }
                    );

                return {
                    svg: svg,
                    panZoom: panZoom
                };
            });
    }

    function messageFilterItem(message, lang) {
        var name = localized(
            message.name,
            lang,
            message.id || ''
        );

        return {
            name: message.id + ' — ' + name,
            value: message.id,
            children: []
        };
    }

    function buildMessageFilterOptions(usecases, lang) {
        var messages =
            (usecases && usecases.messages) || [];

        var incoming = [];
        var outgoing = [];

        messages.forEach(function (message) {
            if (!message || !message.id) {
                return;
            }

            var item =
                messageFilterItem(message, lang);

            if (message.sender === 'EO') {
                incoming.push(item);
            } else {
                outgoing.push(item);
            }
        });

        return [
            {
                name: t('dataModel.allMessages'),
                value: '__all__',
                children: [
                    {
                        name: t(
                            'messageExchangePage.incomingMessages'
                        ),
                        value: '__incoming__',
                        children: incoming
                    },
                    {
                        name: t(
                            'messageExchangePage.outgoingMessages'
                        ),
                        value: '__outgoing__',
                        children: outgoing
                    }
                ]
            }
        ];
    }

    function messageCheckboxIcon() {
        return el('span', {
            className: 'mig-treeselect-checkbox-checked',
            attrs: {
                'aria-hidden': 'true'
            }
        });
    }

    function messagePartialCheckboxIcon() {
        return el('span', {
            className: 'mig-treeselect-checkbox-partial',
            attrs: {
                'aria-hidden': 'true'
            }
        });
    }

    function filterDataByMessages(data, messageIds) {
        var selected =
            Object.create(null);

        (messageIds || []).forEach(function (messageId) {
            selected[messageId] = true;
        });

        var filtered =
            Object.create(null);

        Object.keys(data || {}).forEach(function (path) {
            var entry = data[path];

            if (!entry || !entry.messages) {
                return;
            }

            var messages =
                Object.create(null);

            Object.keys(entry.messages).forEach(function (
                messageId
            ) {
                if (selected[messageId]) {
                    messages[messageId] =
                        entry.messages[messageId];
                }
            });

            if (!Object.keys(messages).length) {
                return;
            }

            filtered[path] =
                Object.assign(
                    {},
                    entry,
                    {
                        messages: messages
                    }
                );
        });

        return filtered;
    }

    function renderMessageFilter(target, usecases, lang, onChange) {
        target = document.querySelector(
            target || '#migMessageFilter'
        );

        if (!target) {
            return null;
        }

        if (!global.Treeselect) {
            throw new Error(
                'Treeselect is not available.'
            );
        }

        if (
            messageTreeselect &&
            typeof messageTreeselect.destroy ===
            'function'
        ) {
            messageTreeselect.destroy();
        }

        target.innerHTML = '';

        var messages =
            (usecases && usecases.messages) || [];

        selectedMessageIds = messages
            .filter(function (message) {
                return message && message.id;
            })
            .map(function (message) {
                return message.id;
            });

        if (!selectedMessageIds.length) {
            return null;
        }

        messageTreeselect = new global.Treeselect({
            parentHtmlContainer: target,

            options:
                buildMessageFilterOptions(
                    usecases,
                    lang
                ),

            value: selectedMessageIds.slice(),

            id: 'migMessageSelect',
            ariaLabel:
                t('dataModel.messageFilter'),

            isSingleSelect: false,
            isGroupedValue: false,
            isIndependentNodes: false,

            openLevel: 1,
            showCount: true,

            searchable: true,
            clearable: true,
            showTags: false,
            grouped: true,

            placeholder:
                t('dataModel.messageFilter'),

            tagsCountText:
                t('dataModel.messagesSelected'),

            emptyText:
                t('dataModel.noMessagesFound'),

            iconElements: {
                check: messageCheckboxIcon(),
                partialCheck: messagePartialCheckboxIcon()
            },

            inputCallback: function (value) {
                selectedMessageIds =
                    Array.isArray(value)
                        ? value.slice()
                        : [];

                if (typeof onChange === 'function') {
                    onChange();
                }
            }
        });

        return messageTreeselect;
    }

    function init(options) {
        options = options || {};

        var target =
            document.querySelector(
                options.target || '#canvas'
            );

        if (!target) {
            return Promise.resolve(null);
        }

        var lang =
            options.lang ||
            document.body.dataset.lang ||
            document.documentElement.lang ||
            'en';

        var introUrl =
            options.introUrl ||
            '../../common/intro.json';

        target.innerHTML = '';

        return global.MIGIntro
            .loadIntro(introUrl)
            .then(function (intro) {
                var versionId =
                    options.versionId ||
                    global.MIGIntro
                        .resolveActiveVersion(
                            intro,
                            options
                        );

                var dataUrl =
                    options.dataUrl ||
                    global.MIGIntro
                        .versionedCommonUrl(
                            versionId,
                            'data.json',
                            introUrl
                        );

                var usecasesUrl =
                    options.usecasesUrl ||
                    global.MIGIntro
                        .versionedCommonUrl(
                            versionId,
                            'usecases.json',
                            introUrl
                        );

                return Promise.all([
                    global.MIGIntro.loadJson(dataUrl),
                    global.MIGIntro.loadJson(usecasesUrl)
                ]).then(function (results) {
                    var data = results[0];
                    var usecases = results[1];

                    function renderCurrentModel() {
                        var filteredData =
                            filterDataByMessages(
                                data,
                                selectedMessageIds
                            );

                        var model =
                            buildModel(
                                filteredData,
                                lang
                            );

                        var dot =
                            buildDot(model);

                        return renderSvg(
                            dot,
                            target
                        ).then(function (rendered) {
                            return {
                                model: model,
                                dot: dot,
                                rendered: rendered
                            };
                        });
                    }

                    renderMessageFilter(
                        '#migMessageFilter',
                        usecases,
                        lang,
                        function () {
                            renderCurrentModel()
                                .catch(function (error) {
                                    renderErrorAlert(
                                        target,
                                        t('messageExchangePage.loadError'),
                                        error
                                    );
                                });
                        }
                    );

                    return renderCurrentModel().then(function (
                        result
                    ) {
                        return {
                            versionId:
                                versionId,
                            dataUrl:
                                dataUrl,
                            model:
                                result.model,
                            dot:
                                result.dot,
                            svg:
                                result.rendered.svg,
                            panZoom:
                                result.rendered.panZoom
                        };
                    });
                });
            })
            .catch(function (error) {
                renderErrorAlert(
                    target,
                    t('messageExchangePage.loadError'),
                    error
                );

                return null;
            });
    }

    function autoInit() {
        init();
    }

    global.MIG_I18N.ready(autoInit);

    global.MIGDataModel = {
        init: init,
        buildModel: buildModel,
        buildDot: buildDot
    };
}(window));