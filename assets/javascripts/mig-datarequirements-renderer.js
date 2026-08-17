(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var el = global.MIGUtils.el;
    var safeId = global.MIGUtils.safeId;
    var localized = global.MIGUtils.localized;
    var loadJson = global.MIGUtils.loadJson;
    var markdownToHtml = global.MIGUtils.markdownToHtml;
    var externalizeLinks = global.MIGUtils.externalizeLinks;

    var GROUP_COLUMNS = [
        {
            key: 'dataGroup',
            labelKey: 'dataRequirements.tableHeaders.dataGroup',
            helpKey: 'dataRequirements.tableHeaderHelp.dataGroup'
        },
        {
            key: 'validation',
            labelKey: 'dataRequirements.tableHeaders.validation',
            helpKey: 'dataRequirements.tableHeaderHelp.validation'
        },
        {
            key: 'cardinality',
            labelKey: 'dataRequirements.tableHeaders.cardinality',
            helpKey: 'dataRequirements.tableHeaderHelp.cardinality'
        },
        {
            key: 'path',
            labelKey: 'dataRequirements.tableHeaders.path',
            helpKey: 'dataRequirements.tableHeaderHelp.pathGroup'
        },
        {
            key: 'constraints',
            labelKey: 'dataRequirements.tableHeaders.constraints',
            helpKey: 'dataRequirements.tableHeaderHelp.constraints'
        }
    ];

    var ELEMENT_COLUMNS = [
        {
            key: 'dataElement',
            labelKey: 'dataRequirements.tableHeaders.dataElement',
            helpKey: 'dataRequirements.tableHeaderHelp.dataElement'
        },
        {
            key: 'validation',
            labelKey: 'dataRequirements.tableHeaders.validation',
            helpKey: 'dataRequirements.tableHeaderHelp.validation'
        },
        {
            key: 'format',
            labelKey: 'dataRequirements.tableHeaders.format',
            helpKey: 'dataRequirements.tableHeaderHelp.format'
        },
        {
            key: 'path',
            labelKey: 'dataRequirements.tableHeaders.path',
            helpKey: 'dataRequirements.tableHeaderHelp.pathElement'
        },
        {
            key: 'codeList',
            labelKey: 'dataRequirements.tableHeaders.codeList',
            helpKey: 'dataRequirements.tableHeaderHelp.codeList'
        },
        {
            key: 'constraints',
            labelKey: 'dataRequirements.tableHeaders.constraints',
            helpKey: 'dataRequirements.tableHeaderHelp.constraints'
        }
    ];

    var COMBINED_COLUMNS = [
        {
            key: 'data',
            labelKey: 'dataRequirements.tableHeaders.data',
            helpKey: 'dataRequirements.tableHeaderHelp.data'
        },
        {
            key: 'validation',
            labelKey: 'dataRequirements.tableHeaders.validation',
            helpKey: 'dataRequirements.tableHeaderHelp.validation'
        },
        {
            key: 'formatCardinality',
            labelKey: 'dataRequirements.tableHeaders.formatCardinality',
            helpKey: 'dataRequirements.tableHeaderHelp.formatCardinality'
        },
        {
            key: 'path',
            labelKey: 'dataRequirements.tableHeaders.path',
            helpKey: 'dataRequirements.tableHeaderHelp.path'
        },
        {
            key: 'codeList',
            labelKey: 'dataRequirements.tableHeaders.codeList',
            helpKey: 'dataRequirements.tableHeaderHelp.codeList'
        },
        {
            key: 'constraints',
            labelKey: 'dataRequirements.tableHeaders.constraints',
            helpKey: 'dataRequirements.tableHeaderHelp.constraints'
        }
    ];

    function refreshTooltips() {
        if (global.MIGIntro && typeof global.MIGIntro.refreshTooltips === 'function') {
            global.MIGIntro.refreshTooltips();
            return;
        }

        if (global.jQuery && global.jQuery.fn && typeof global.jQuery.fn.tooltip === 'function') {
            global.jQuery('[data-toggle="tooltip"]').tooltip();
        }
    }

    function renderMarkdownInto(target, value) {
        var html = markdownToHtml(value);

        if (!html) {
            target.textContent = value || '';
            return;
        }

        target.innerHTML = html;
        externalizeLinks(target);
    }

    function loadMessage(url, target, options) {
        options = options || {};

        return loadJson(url).then(function (data) {
            renderMessage(data, target, options);
            return data;
        });
    }

    function renderMessage(data, target, options) {
        options = options || {};

        target.innerHTML = '';

        var messageId = options.messageId || (options.message && options.message.id);
        var messageData = findMessageData(data, messageId, options);

        if (!messageData || !messageData.rows.length) {
            target.textContent = 'No data requirements found for ' + messageId;
            return;
        }

        if (options.viewMode === 'table') {
            renderSingleTable(messageData, target);
        } else {
            renderSplitView(messageData, target);
        }
        refreshTooltips(target);
    }

    function sectionHeadingId(messageId, titleKey) {
        return 'dataRequirements_' +
            safeId(messageId) +
            '_' +
            safeId(titleKey);
    }

    function renderSectionHeading(
        target,
        key,
        headingId
    ) {
        var heading = el('h3', {
            className:
                'data-requirements-section-heading',
            text: t(key),
            attrs: {
                id: headingId
            }
        });

        target.appendChild(heading);

        return heading;
    }

    function renderColumnHeader(column) {
        var th = el('th', {
            attrs: {
                scope: 'col',
                'data-column': column.key
            }
        });

        var label = t(column.labelKey);
        var helpText = column.helpKey ? t(column.helpKey) : '';

        if (!helpText) {
            th.textContent = label;
            return th;
        }

        var button = el('button', {
            className: 'thead-link data-requirements-header-help',
            attrs: {
                type: 'button',
                'data-toggle': 'tooltip',
                'data-placement': 'top',
                'data-container': 'body',
                title: helpText,
                'aria-label': label + ': ' + helpText
            }
        });

        button.appendChild(el('span', {
            className: 'icon icon-tulli-help',
            attrs: {
                'aria-hidden': 'true'
            }
        }));

        button.appendChild(document.createTextNode(label));

        th.appendChild(button);

        return th;
    }

    function renderTableShell(columns, tableClassName) {
        var table = el('table', {
            className: 'table table-responsive data-requirements-table ' + (tableClassName || '')
        });

        var thead = el('thead');
        var headerRow = el('tr');

        columns.forEach(function (column) {
            headerRow.appendChild(renderColumnHeader(column));
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        table.appendChild(el('tbody'));

        return table;
    }

    function renderSection(
        target,
        messageId,
        titleKey,
        columns,
        tableClassName
    ) {
        var headingId =
            sectionHeadingId(
                messageId,
                titleKey
            );

        renderSectionHeading(
            target,
            titleKey,
            headingId
        );

        var table =
            renderTableShell(
                columns,
                tableClassName
            );

        table.setAttribute(
            'aria-labelledby',
            headingId
        );

        target.appendChild(table);

        return table;
    }

    function isGroupRow(row) {
        return String(row.kind || '').toLowerCase() === 'group';
    }

    function isElementRow(row) {
        return String(row.kind || '').toLowerCase() === 'element';
    }

    function formatList(value) {
        if (!value) return '';

        if (Array.isArray(value)) {
            return value.join(', ');
        }

        return String(value);
    }

    function formatFormatCardinality(row) {
        return row.format || row.cardinality + 'x' || '';
    }

    function columnValue(row, column) {
        switch (column.key) {
            case 'dataGroup':
            case 'dataElement':
            case 'data':
                return row.name || '';

            case 'validation':
                return row.validation || '';

            case 'cardinality':
                return row.cardinality + 'x' || '';

            case 'format':
                return row.format || '';

            case 'formatCardinality':
                return formatFormatCardinality(row);

            case 'path':
                return row.path || '';

            case 'codeList':
                return formatList(row.codeList);

            case 'constraints':
                return formatList(row.constraints);

            default:
                return row[column.key] || '';
        }
    }

    function renderTableBody(table, rows, columns, options) {
        var tbody = table.querySelector('tbody');

        if (!tbody) return;

        rows.forEach(function (row) {
            tbody.appendChild(renderDataRow(row, columns, options));

            if (row.description) {
                tbody.appendChild(
                    renderDescriptionRow(
                        row,
                        columns,
                        options
                    )
                );
            }
        });
    }

    function renderElementHierarchyBody(table, rows, columns, options) {
        options = options || {};

        var tbody = table.querySelector('tbody');

        if (!tbody) return;

        rows.forEach(function (row) {
            if (isGroupRow(row)) {
                tbody.appendChild(renderElementGroupRow(row, columns));
                return;
            }

            if (!isElementRow(row)) return;

            tbody.appendChild(
                renderDataRow(
                    row,
                    columns,
                    options
                )
            );

            if (row.description) {
                tbody.appendChild(
                    renderDescriptionRow(
                        row,
                        columns,
                        options
                    )
                );
            }
        });
    }

    function renderElementGroupRow(row, columns) {
        var tr = el('tr', {
            className: [
                'data-requirements-group',
                'indent-' + (row.level || 0),
            ].join(' '),
            attrs: {
                id: groupElementAnchorId(row)
            }
        });

        var td = el('td', {
            attrs: {
                colspan: String(columns.length),
                'data-column': 'dataGroup'
            }
        });

        var link = el('a', {
            attrs: {
                href: '#' + groupSummaryAnchorId(row)
            }
        });

        appendValueWithOptionalIcon(link, row, { key: 'dataGroup' }, row.name || row.path || '');

        td.appendChild(link);

        tr.appendChild(td);

        return tr;
    }

    function renderDataRow(row, columns, options) {
        options = options || {};

        var kind =
            String(row.kind || '').toLowerCase();

        var accessibilityIds =
            rowAccessibilityIds(
                row,
                options
            );

        var tr = el('tr', {
            className: [
                'data-requirements-row',
                'data-requirements-' + kind,
                'indent-' + (row.level || 0),
                'all',
                'oddeven'
            ].join(' ')
        });

        if (
            options.rowId &&
            typeof options.rowId === 'function'
        ) {
            var rowId =
                options.rowId(row);

            if (rowId) {
                tr.setAttribute(
                    'id',
                    rowId
                );
            }
        }

        columns.forEach(function (column) {
            tr.appendChild(
                renderDataCell(
                    row,
                    column,
                    options,
                    accessibilityIds
                )
            );
        });

        return tr;
    }

    function safeFragmentId(value) {
        return String(value || '')
            .replace(/\u200B/g, '')
            .replace(/[^A-Za-z0-9_-]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    function rowAccessibilityIds(row, options) {
        options = options || {};

        if (
            !row.description ||
            !options.messageId
        ) {
            return null;
        }

        var base = [
            safeId(options.messageId),
            safeId(options.idPrefix || 'table'),
            safeFragmentId(
                row.sourcePath ||
                row.path ||
                row.name
            )
        ].join('_');

        return {
            nameCellId:
                'dataRequirements_data_' + base,

            descriptionId:
                'dataRequirements_description_' + base
        };
    }

    function groupAnchorBase(row) {
        return safeFragmentId(row.sourcePath || row.path || row.name);
    }

    function groupSummaryAnchorId(row) {
        return 'Group_' + groupAnchorBase(row);
    }

    function groupElementAnchorId(row) {
        return 'Element_' + groupAnchorBase(row);
    }

    function isNameColumn(column) {
        return column.key === 'dataGroup' ||
            column.key === 'dataElement' ||
            column.key === 'data';
    }

    function rowIconClass(row) {
        if (isGroupRow(row)) {
            return 'icon icon-tulli-treeview data-requirements-row-icon data-requirements-group-icon';
        }

        if (isElementRow(row)) {
            return 'icon icon-tulli-hamburger-menu data-requirements-row-icon data-requirements-element-icon';
        }

        return '';
    }

    function appendValueWithOptionalIcon(target, row, column, value) {
        var iconClass = isNameColumn(column) ? rowIconClass(row) : '';

        if (iconClass) {
            target.appendChild(el('span', {
                className: iconClass,
                attrs: {
                    'aria-hidden': 'true'
                }
            }));
        }

        target.appendChild(document.createTextNode(value || ''));
    }

    function normalizeReferenceValues(value) {
        if (!value) return [];

        return Array.isArray(value)
            ? value.filter(Boolean)
            : [value];
    }

    function renderReferenceButtons(target, type, value) {
        var values = normalizeReferenceValues(value);

        values.forEach(function (id, index) {
            if (index > 0) {
                target.appendChild(document.createTextNode(', '));
            }

            target.appendChild(el('button', {
                className: 'data-requirements-reference modalToggle',
                text: id,
                attrs: {
                    type: 'button',
                    'data-reference-type': type,
                    'data-reference-id': id,
                    'aria-haspopup': 'dialog'
                }
            }));
        });
    }

    function renderDataCell(
        row,
        column,
        options,
        accessibilityIds
    ) {
        options = options || {};

        var isRowHeader =
            isNameColumn(column);

        var td = el(
            isRowHeader ? 'th' : 'td',
            {
                attrs: {
                    'data-column': column.key
                }
            }
        );

        if (isRowHeader) {
            td.setAttribute(
                'scope',
                'row'
            );
        }

        if (
            accessibilityIds &&
            isNameColumn(column)
        ) {
            td.setAttribute(
                'id',
                accessibilityIds.nameCellId
            );

            td.setAttribute(
                'aria-describedby',
                accessibilityIds.descriptionId
            );
        }

        if (column.key === 'codeList') {
            renderReferenceButtons(td, 'code-list', row.codeList);
            return td;
        }

        if (column.key === 'constraints') {
            renderReferenceButtons(td, 'constraint', row.constraints);
            return td;
        }

        var value = columnValue(row, column);
        var href = options.cellHref && typeof options.cellHref === 'function'
            ? options.cellHref(row, column)
            : '';

        if (href) {
            var link = el('a', {
                attrs: {
                    href: href
                }
            });

            appendValueWithOptionalIcon(link, row, column, value);
            td.appendChild(link);
        } else {
            appendValueWithOptionalIcon(td, row, column, value);
        }

        return td;
    }

    function renderDescriptionRow(
        row,
        columns,
        options
    ) {
        var accessibilityIds =
            rowAccessibilityIds(
                row,
                options
            );

        var tr = el('tr', {
            className:
                'data-requirements-description-row'
        });

        var td = el('td', {
            attrs: {
                colspan:
                    String(columns.length)
            }
        });

        if (accessibilityIds) {
            td.setAttribute(
                'id',
                accessibilityIds.descriptionId
            );
        }

        renderMarkdownInto(
            td,
            row.description
        );

        tr.appendChild(td);

        return tr;
    }

    function rowHasSubset(row, subset) {
        return Array.isArray(row.subsets) &&
            row.subsets.indexOf(subset) !== -1;
    }

    function filterRowsBySubset(rows, subset) {
        subset = String(subset || '').trim();

        /*
         * Empty value means "Show all".
         */
        if (!subset) {
            return rows;
        }

        /*
         * The selected subset may belong to another message.
         * In that case this message remains completely unfiltered.
         */
        var subsetApplies = rows.some(function (row) {
            return rowHasSubset(row, subset);
        });

        if (!subsetApplies) {
            return rows;
        }

        /*
         * Index rows by their original data.json path.
         *
         * We deliberately use sourcePath rather than the rendered
         * path because the rendered path removes qualifiers and
         * replaces {Declaration}.
         */
        var rowsByPath = Object.create(null);

        rows.forEach(function (row) {
            rowsByPath[row.sourcePath] = row;
        });

        var keepPaths = Object.create(null);

        /*
         * Elements are the actual filtering targets.
         *
         * A Group is never retained merely because the Group itself
         * carries the selected subset. It survives only when a
         * retained Element exists somewhere beneath it.
         */
        rows.forEach(function (row) {
            if (
                !isElementRow(row) ||
                !rowHasSubset(row, subset)
            ) {
                return;
            }

            keepPaths[row.sourcePath] = true;

            /*
             * Walk upward through the original path and retain every
             * Group needed to provide an unbroken ancestor chain.
             */
            var ancestorPath = row.sourcePath;

            while (ancestorPath.indexOf('/') !== -1) {
                ancestorPath = ancestorPath.substring(
                    0,
                    ancestorPath.lastIndexOf('/')
                );

                var ancestor = rowsByPath[ancestorPath];

                if (ancestor && isGroupRow(ancestor)) {
                    keepPaths[ancestorPath] = true;
                }
            }
        });

        return rows.filter(function (row) {
            return keepPaths[row.sourcePath] === true;
        });
    }

    function findMessageData(data, messageId, options) {
        options = options || {};

        var lang = options.lang || 'en';
        var rows = [];

        function messagePath(path, messageId, declarationRoot) {
            return String(path || '')
                .replace(/#[^/]+(?=\/|$)/g, '')
                .replace(
                    '{Declaration}',
                    declarationRoot || messageId
                );
        }

        Object.keys(data || {}).forEach(function (path) {
            var item = data[path];

            if (!item || !item.messages || !item.messages[messageId]) return;

            var messageInfo = item.messages[messageId];

            rows.push({
                sourcePath: path,
                path: messagePath(
                    path,
                    messageId,
                    options.declarationRoot
                ),
                kind: item.kind || '',
                level: item.level || 0,
                subsets: Array.isArray(messageInfo.subsets)
                    ? messageInfo.subsets.slice()
                    : [],
                name: localized(item.name, lang, path),
                format: item.format || '',
                validation: messageInfo.Validation || '',
                cardinality: messageInfo.maxOccurrence || '',
                codeList: messageInfo.codeList || '',
                constraints: (messageInfo.constraints || []).slice(),
                description: localized(messageInfo.description, lang, ''),

                //source: item,
                //messageSource: messageInfo
            });
        });

        rows = filterRowsBySubset(
            rows,
            options.subset
        );

        return {
            messageId: messageId,
            rows: rows
        };
    }

    function renderSplitView(messageData, target) {
        var groupRows = messageData.rows.filter(isGroupRow);

        var groupTable = renderSection(
            target,
            messageData.messageId,
            'dataRequirements.sections.groups',
            GROUP_COLUMNS,
            'data-requirements-groups-table'
        );

        renderTableBody(
            groupTable,
            groupRows,
            GROUP_COLUMNS,
            {
                messageId:
                    messageData.messageId,

                idPrefix:
                    'groups',

                rowId: function (row) {
                    return groupSummaryAnchorId(row);
                },

                cellHref: function (row, column) {
                    if (
                        isGroupRow(row) &&
                        column.key === 'dataGroup'
                    ) {
                        return '#' +
                            groupElementAnchorId(row);
                    }

                    return '';
                }
            }
        );

        var elementTable = renderSection(
            target,
            messageData.messageId,
            'dataRequirements.sections.elements',
            ELEMENT_COLUMNS,
            'data-requirements-elements-table'
        );

        renderElementHierarchyBody(
            elementTable,
            messageData.rows,
            ELEMENT_COLUMNS,
            {
                messageId:
                    messageData.messageId,

                idPrefix:
                    'elements'
            }
        );
    }

    function renderSingleTable(messageData, target) {
        var table = renderSection(
            target,
            messageData.messageId,
            'dataRequirements.sections.dataStructure',
            COMBINED_COLUMNS,
            'data-requirements-combined-table'
        );

        renderTableBody(
            table,
            messageData.rows,
            COMBINED_COLUMNS,
            {
                messageId:
                    messageData.messageId,

                idPrefix:
                    'structure'
            }
        );
    }

    global.MIGDataRequirementsRenderer = {
        loadMessage: loadMessage,
        renderMessage: renderMessage
    };
})(window);