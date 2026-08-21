(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var el = global.MIGUtils.el;
    var localized = global.MIGUtils.localizedCoerce;
    var safeId = global.MIGUtils.safeId;
    var localeForLanguage = global.MIGUtils.localeForLanguage;
    var announceStatus = global.MIGUtils.announceStatus;
    var renderErrorAlert = global.MIGUtils.renderErrorAlert;
    var selectedMessageIds = [];
    var messageTreeselect = null;

    function normalizePath(value) {
        return String(value || '').replace(/[\u200B-\u200D\uFEFF]/g, '');
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
                var message = group.messages[messageId] || {};

                var value = Number(message.maxOccurrence);

                if (Number.isFinite(value) && value > maximum) {
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

        // English name is the intended class identity. The path fallback only prevents unrelated unnamed groups from accidentally being merged.
        return englishName || normalizePath(path);
    }

    function buildModel(data, lang) {
        var entriesByPath = Object.create(null);
        var groupsByPath = Object.create(null);
        var classes = Object.create(null);
        var associations = Object.create(null);

        // First normalize every JSON path.
        Object.keys(data || {}).forEach(function (sourcePath) {
            var entry = data[sourcePath];

            if (!entry) {
                return;
            }

            var path = normalizePath(sourcePath);

            entriesByPath[path] = entry;

            if (entry.kind === 'Group') {
                groupsByPath[path] = entry;
            }
        });

        // Build one class for each unique English Group name.
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

        // Add direct child Elements to their parent Group.
        // Element identity is also based on its English name, so repeated appearances inside the same class are collapsed.
        Object.keys(entriesByPath).forEach(function (path) {
            var entry = entriesByPath[path];

            if (entry.kind !== 'Element') {
                return;
            }

            var parent = parentPath(path);
            var parentGroup = groupsByPath[parent];

            if (!parentGroup) {
                return;
            }

            var classId = classIdentity(parentGroup, parent);

            var targetClass = classes[classId];

            if (!targetClass) {
                return;
            }

            var elementId = localized(entry.name, 'en', path);

            if (
                !targetClass.elements[elementId]
            ) {
                targetClass.elements[elementId] = {
                    id: elementId,
                    name: localized(entry.name, lang, elementId)
                };
            }
        });

        // Direct Group -> Group relationships only.
        Object.keys(groupsByPath).forEach(function (childPath) {
            var child = groupsByPath[childPath];
            var parent = parentPath(childPath);
            var parentGroup = groupsByPath[parent];

            if (!parentGroup) {
                return;
            }

            var parentId = classIdentity(parentGroup, parent);
            var childId = classIdentity(child, childPath);
            var key = parentId + '\u0000' + childId;
            var occurrence = maxOccurrence(child);

            if (!associations[key]) {
                associations[key] = {
                    parent: parentId,
                    child: childId,
                    maxOccurrence: occurrence
                };

                return;
            }

            // Same class association may appear in several source paths. Keep the largest maxOccurrence.
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
                    var item = classes[id];

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

        item.elements.forEach(function (element, index) {
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

    function renderAccessibleModel(model, target) {
        var section = el('section', {
            className: 'visually-hidden',
            attrs: { 'aria-labelledby': 'dataModelAccessibleTitle' }
        });

        section.appendChild(el('h2', {
            text: t('dataModel.accessibleDiagram'),
            attrs: { id: 'dataModelAccessibleTitle' }
        }));

        section.appendChild(el('h3', { text: t('dataModel.classes') }));

        model.classes.forEach(function (item) {
            section.appendChild(el('h4', { text: item.name }));

            if (item.elements.length) {
                section.appendChild(el('h5', { text: t('dataModel.dataElements') }));

                var list = el('ul');

                item.elements.forEach(function (element) {
                    list.appendChild(el('li', { text: element.name }));
                });

                section.appendChild(list);
            }
        });

        renderAccessibleAssociations(model, section);

        target.appendChild(section);
    }

    function renderAccessibleAssociations(model, target) {
        if (!model.associations.length) {
            return;
        }

        target.appendChild(el('h3', { text: t('dataModel.relationships') }));

        var namesById = Object.create(null);

        model.classes.forEach(function (item) {
            namesById[item.id] = item.name;
        });

        var table = el('table');

        var thead = el('thead');
        var headerRow = el('tr');

        [
            t('dataModel.parentClass'),
            t('dataModel.childClass'),
            t('dataModel.parentCardinality'),
            t('dataModel.childCardinality')
        ].forEach(function (label) {
            headerRow.appendChild(el('th', {
                text: label,
                attrs: {
                    scope: 'col'
                }
            }));
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = el('tbody');

        model.associations.forEach(function (association) {
            var row = el('tr');

            row.appendChild(el('th', {
                text:
                    namesById[association.parent] || association.parent,
                attrs: {
                    scope: 'row'
                }
            }));

            row.appendChild(el('td', { text: namesById[association.child] || association.child }));
            row.appendChild(el('td', { text: '1' }));
            row.appendChild(el('td', { text: '0..' + association.maxOccurrence }));

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        target.appendChild(table);
    }

    function renderDiagramControls(target, panZoom) {
        var controls = el('div', {
            className: 'mig-datamodel-controls',
            attrs: {
                role: 'group',
                'aria-label':
                    t('dataModel.diagramControls')
            }
        });

        function control(labelKey, visualText, action) {
            var button = el('button', {
                className:
                    'btn btn-default btn-sm',
                attrs: {
                    type: 'button',
                    'aria-label': t(labelKey),
                    title: t(labelKey),
                    'data-bs-toggle': 'tooltip',
                    'data-bs-placement': 'bottom',
                    'data-bs-container': 'body'
                }
            });

            button.appendChild(el('span', {
                text: visualText,
                attrs: {
                    'aria-hidden': 'true'
                }
            }));

            button.addEventListener(
                'click',
                action
            );

            controls.appendChild(button);
        }

        control(
            'dataModel.panLeft',
            '←',
            function () {
                panZoom.panBy({
                    x: 50,
                    y: 0
                });
            }
        );

        control(
            'dataModel.panUp',
            '↑',
            function () {
                panZoom.panBy({
                    x: 0,
                    y: 50
                });
            }
        );

        control(
            'dataModel.panDown',
            '↓',
            function () {
                panZoom.panBy({
                    x: 0,
                    y: -50
                });
            }
        );

        control(
            'dataModel.panRight',
            '→',
            function () {
                panZoom.panBy({
                    x: -50,
                    y: 0
                });
            }
        );

        control(
            'dataModel.zoomIn',
            '+',
            function () {
                panZoom.zoomIn();
            }
        );

        control(
            'dataModel.zoomOut',
            '−',
            function () {
                panZoom.zoomOut();
            }
        );

        control(
            'dataModel.resetView',
            'Reset',
            function () {
                panZoom.resetZoom();
                panZoom.resetPan();
                panZoom.fit();
                panZoom.center();
            }
        );

        target.insertBefore(
            controls,
            target.firstChild
        );

        if (global.bootstrap && global.bootstrap.Tooltip) {
            controls.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (button) {
                global.bootstrap.Tooltip.getOrCreateInstance(button);
            });
        }
    }

    function renderSvg(dot, target) {
        return global.Viz.instance()
            .then(function (viz) {
                var svg =
                    viz.renderSVGElement(dot);

                target.innerHTML = '';
                target.appendChild(svg);

                svg.setAttribute('aria-hidden', 'true');
                svg.setAttribute('focusable', 'false');

                var panZoom =
                    global.svgPanZoom(
                        svg,
                        {
                            zoomEnabled: true,
                            controlIconsEnabled: false,
                            preventMouseEventsDefault: false,
                            fit: true,
                            center: true
                        }
                    );

                renderDiagramControls(
                    target,
                    panZoom
                );

                if (renderSvg.resizeHandler) global.removeEventListener('resize', renderSvg.resizeHandler);
                renderSvg.resizeHandler = function () { panZoom.resize(); };
                global.addEventListener('resize', renderSvg.resizeHandler);

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
        var selected = Object.create(null);

        (messageIds || []).forEach(function (messageId) {
            selected[messageId] = true;
        });

        var filtered = Object.create(null);

        Object.keys(data || {}).forEach(function (path) {
            var entry = data[path];

            if (!entry || !entry.messages) {
                return;
            }

            var messages = Object.create(null);

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

    function messageTreeItemValue(item) {
        var checkbox = item.querySelector('.treeselect-list__item-checkbox');

        return checkbox ? checkbox.getAttribute('input-id') : '';
    }

    function messageTreeItemLevel(item) {
        var level = 1;
        var node = item.parentElement;

        while (
            node &&
            !node.classList.contains('treeselect-list')
        ) {
            if (node.classList.contains('treeselect-list__group-container')) {
                level += 1;
            }

            node = node.parentElement;
        }

        // Group items sit one level higher than their leaf contents in Treeselect's DOM.
        if (item.classList.contains('treeselect-list__item--group')) {
            level -= 1;
        }

        return Math.max(level, 1);
    }

    function syncMessageTreeItemState(item) {
        var isPartial = item.classList.contains('treeselect-list__item--partial-checked');
        var isChecked = item.classList.contains('treeselect-list__item--checked');

        item.setAttribute(
            'aria-checked',
            isPartial
                ? 'mixed'
                : isChecked
                    ? 'true'
                    : 'false'
        );
    }

    function renderMessageFilter(target, usecases, lang, onChange) {
        target = document.querySelector(target || '#migMessageFilter');

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

        var messages = (usecases && usecases.messages) || [];

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
            ariaLabel: t('dataModel.messageFilter'),

            isSingleSelect: false,
            isGroupedValue: false,
            isIndependentNodes: false,

            alwaysOpen: true,

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
                selectedMessageIds = Array.isArray(value) ? value.slice() : [];

                var list = target.querySelector('.treeselect-list');

                if (list) {
                    list.querySelectorAll('.treeselect-list__item').forEach(
                        syncMessageTreeItemState
                    );
                }

                if (typeof onChange === 'function') {
                    onChange();
                }
            },

            openCallback: function () {
                decorateMessageTree(target);

                var input = target.querySelector('#migMessageSelect');

                if (input) {
                    input.setAttribute('aria-expanded', 'true');
                }

                scheduleMessageTreeActiveDescendant(target);
            },

            closeCallback: function () {
                var input = target.querySelector('#migMessageSelect');

                if (input) {
                    input.setAttribute('aria-expanded', 'false');

                    input.removeAttribute('aria-activedescendant');
                }
            },

            openCloseGroupCallback: function (groupId, isClosed) {
                var item = null;

                target.querySelectorAll('.treeselect-list__item').forEach(function (candidate) {
                    if (messageTreeItemValue(candidate) === String(groupId)) {
                        item = candidate;
                    }
                });

                if (item) {
                    item.setAttribute('aria-expanded', isClosed ? 'false' : 'true');
                }
            },
        });

        decorateMessageTree(target);

        target.addEventListener('keydown', function () { scheduleMessageTreeActiveDescendant(target); });
        target.addEventListener('click', function () { scheduleMessageTreeActiveDescendant(target); });

        return messageTreeselect;
    }

    function syncMessageTreeActiveDescendant(target) {
        var input = target.querySelector('#migMessageSelect');

        if (!input) {
            return;
        }

        var focused = target.querySelector('.treeselect-list__item--focused');

        if (focused && focused.id) {
            input.setAttribute('aria-activedescendant', focused.id);
        } else {
            input.removeAttribute('aria-activedescendant');
        }
    }

    function scheduleMessageTreeActiveDescendant(target) {
        window.requestAnimationFrame(
            function () {
                syncMessageTreeActiveDescendant(target);
            }
        );
    }

    function decorateMessageTree(target) {
        var input = target.querySelector('#migMessageSelect');
        var list = target.querySelector('.treeselect-list');

        if (input) {
            input.setAttribute('role', 'combobox');
            input.setAttribute('aria-haspopup', 'tree');
            input.setAttribute('aria-controls', 'migMessageTree');
            input.setAttribute('aria-autocomplete', 'list');
            input.setAttribute('aria-expanded', list ? 'true' : 'false');
        }

        if (!list) {
            return;
        }

        list.setAttribute('id', 'migMessageTree');
        list.setAttribute('role', 'tree');
        list.setAttribute('aria-multiselectable', 'true');
        list.setAttribute('aria-label', t('dataModel.messageFilter'));

        list.querySelectorAll('.treeselect-list__item').forEach(function (item) {
            item.setAttribute('role', 'treeitem');

            var value = messageTreeItemValue(item);

            if (value) {
                item.setAttribute('id', 'migMessageTreeItem_' + safeId(value));
            }

            var level = messageTreeItemLevel(item);

            item.setAttribute('aria-level', String(level));

            syncMessageTreeItemState(item);

            if (item.classList.contains('treeselect-list__item--group')
            ) {
                // openLevel: 1 means the root is open while its Incoming/Outgoing groups begin collapsed.
                item.setAttribute('aria-expanded', level === 1 ? 'true' : 'false');
            }

            var checkbox = item.querySelector('.treeselect-list__item-checkbox');

            if (checkbox) {
                checkbox.setAttribute('aria-hidden', 'true');
            }
        });
    }

    function init(options) {
        options = options || {};

        var target = document.querySelector(options.target || '#canvas');

        if (!target) {
            document.body.classList.remove('page-loading');

            return Promise.resolve(null);
        }

        var lang = options.lang || document.body.dataset.lang || document.documentElement.lang || 'en';

        var introUrl = options.introUrl || '../../common/intro.json';

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
                        var filteredData = filterDataByMessages(data, selectedMessageIds);
                        var model = buildModel(filteredData, lang);
                        var dot = buildDot(model);

                        return renderSvg(
                            dot,
                            target
                        ).then(function (rendered) {
                            renderAccessibleModel(
                                model,
                                target
                            );

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
                                .then(function () {
                                    announceStatus(
                                        t('dataModel.updated')
                                    );
                                })
                                .catch(function (error) {
                                    renderErrorAlert(
                                        target,
                                        t('messageExchangePage.loadError'),
                                        error
                                    );
                                });
                        }
                    );

                    return renderCurrentModel().then(function (result) {
                        document.body.classList.remove('page-loading');
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

                document.body.classList.remove('page-loading');

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