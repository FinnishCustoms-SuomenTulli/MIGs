(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var localized = global.MIGUtils.localizedCoerce;

    function oneLine(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function actorText(value) {
        /*
         * js-sequence-diagrams accepts quoted actor names, but its
         * parser does not unescape embedded double quotes. Replace
         * them with apostrophes so the generated source always parses.
         */
        return oneLine(value)
            .replace(/"/g, "'");
    }

    function messageMap(data) {
        var result = Object.create(null);

        (data.messages || []).forEach(function (message) {
            if (
                message &&
                message.id &&
                !result[message.id]
            ) {
                result[message.id] = message;
            }
        });

        return result;
    }

    function messageLabel(step, messages, lang) {
        var messageId = String(step.messageId || '');
        var message = messages[messageId];

        if (!message) {
            return messageId;
        }

        var name = oneLine(
            localized(message.name, lang, '')
        );

        if (!name) {
            return messageId;
        }

        if (!messageId) {
            return name;
        }

        return name + ' (' + messageId + ')';
    }

    function conditionText(endpoint, lang) {
        if (!endpoint || !endpoint.condition) {
            return '';
        }

        return oneLine(
            localized(endpoint.condition, lang, '')
        );
    }

    function appendConditions(label, step, lang) {
        var conditions = [];

        [
            conditionText(step.from, lang),
            conditionText(step.to, lang)
        ].forEach(function (condition) {
            if (
                condition &&
                conditions.indexOf(condition) === -1
            ) {
                conditions.push(condition);
            }
        });

        if (!conditions.length) {
            return label;
        }

        return label + ' [' + conditions.join('; ') + ']';
    }

    function anyJoiner(lang) {
        if (lang === 'fi') {
            return ' tai ';
        }

        if (lang === 'sv') {
            return ' eller ';
        }

        return ' or ';
    }

    function buildSource(useCase, data, lang) {
        useCase = useCase || {};
        data = data || {};
        lang = lang || 'en';

        var messages = messageMap(data);
        var actors = [];
        var actorsByPartyId = Object.create(null);
        var syntheticActors = Object.create(null);
        var usedAliases = Object.create(null);
        var operations = [];

        function addActor(key, label, synthetic, order) {
            var actor = {
                key: key,
                label: actorText(label || key),
                alias: 'P' + (actors.length + 1),
                synthetic: !!synthetic,
                order:
                    Number.isFinite(order)
                        ? order
                        : actors.length
            };

            actors.push(actor);
            return actor;
        }

        (useCase.participants || [])
            .forEach(function (participant) {
                if (!participant || !participant.id) {
                    return;
                }

                actorsByPartyId[participant.id] =
                    addActor(
                        participant.id,
                        localized(
                            participant.label,
                            lang,
                            participant.id
                        ),
                        false,
                        actors.length
                    );
            });

        function actorForParty(partyId) {
            if (actorsByPartyId[partyId]) {
                return actorsByPartyId[partyId];
            }

            /*
             * Be defensive if a future JSON file references a party
             * that was not included in participants.
             */
            actorsByPartyId[partyId] =
                addActor(
                    partyId,
                    partyId,
                    false,
                    actors.length
                );

            return actorsByPartyId[partyId];
        }

        function endpointActors(endpoint) {
            endpoint = endpoint || {};

            var partyIds = endpoint.parties || [];
            var resolved = partyIds.map(actorForParty);

            if (
                endpoint.mode === 'any' &&
                resolved.length > 1
            ) {
                var key = partyIds.join('\u0000');

                if (!syntheticActors[key]) {
                    syntheticActors[key] = addActor(
                        '__any__' + key,
                        resolved.map(function (actor) {
                            return actor.label;
                        }).join(anyJoiner(lang)),
                        true,
                        Math.min.apply(
                            null,
                            resolved.map(function (actor) {
                                return actor.order;
                            })
                        )
                    );
                }

                return [syntheticActors[key]];
            }

            return resolved;
        }

        function markUsed(actor) {
            if (actor) {
                usedAliases[actor.alias] = true;
            }
        }

        function addSignals(
            fromActors,
            toActors,
            label,
            arrow
        ) {
            fromActors.forEach(function (fromActor) {
                toActors.forEach(function (toActor) {
                    markUsed(fromActor);
                    markUsed(toActor);

                    operations.push({
                        type: 'signal',
                        from: fromActor,
                        to: toActor,
                        label: oneLine(label),
                        arrow:
                            arrow === 'dashed'
                                ? '-->'
                                : '->'
                    });
                });
            });
        }

        (useCase.steps || []).forEach(function (step) {
            if (!step) {
                return;
            }

            if (step.type === 'message') {
                var fromActors = endpointActors(step.from);
                var toActors = endpointActors(step.to);

                if (
                    !fromActors.length ||
                    !toActors.length
                ) {
                    return;
                }

                addSignals(
                    fromActors,
                    toActors,
                    appendConditions(
                        messageLabel(
                            step,
                            messages,
                            lang
                        ),
                        step,
                        lang
                    ),
                    step.arrow
                );

                return;
            }

            if (step.type !== 'text') {
                return;
            }

            var text = oneLine(
                localized(
                    step.description,
                    lang,
                    ''
                ) ||
                localized(
                    step.text,
                    lang,
                    ''
                )
            );

            if (!text) {
                return;
            }

            var textFrom = endpointActors(step.from);
            var textTo = endpointActors(step.to);

            if (
                textFrom.length &&
                textTo.length
            ) {
                addSignals(
                    textFrom,
                    textTo,
                    text,
                    step.arrow || 'dashed'
                );

                return;
            }

            operations.push({
                type: 'note',
                label: text
            });
        });

        /*
         * A text-only case is possible. In that situation we still
         * need actors for the note to attach to.
         */
        if (!Object.keys(usedAliases).length) {
            actors.forEach(markUsed);
        }

        var declaredActors = actors
            .filter(function (actor) {
                return !!usedAliases[actor.alias];
            })
            .sort(function (a, b) {
                if (a.order !== b.order) {
                    return a.order - b.order;
                }

                return actors.indexOf(a) - actors.indexOf(b);
            });

        var lines = declaredActors.map(function (actor) {
            return (
                'participant "' +
                actor.label +
                ' as ' +
                actor.alias +
                '"'
            );
        });

        operations.forEach(function (operation) {
            if (operation.type === 'signal') {
                lines.push(
                    operation.from.alias +
                    operation.arrow +
                    operation.to.alias +
                    ': ' +
                    operation.label
                );
                return;
            }

            if (
                operation.type === 'note' &&
                declaredActors.length
            ) {
                if (declaredActors.length === 1) {
                    lines.push(
                        'Note over ' +
                        declaredActors[0].alias +
                        ': ' +
                        operation.label
                    );
                    return;
                }

                lines.push(
                    'Note over ' +
                    declaredActors[0].alias +
                    ',' +
                    declaredActors[
                        declaredActors.length - 1
                    ].alias +
                    ': ' +
                    operation.label
                );
            }
        });

        return lines.join('\n');
    }

    function render(detail, options) {
        options = options || {};

        if (!detail || !detail.container) {
            return null;
        }

        var container = detail.container;

        if (
            container.getAttribute(
                'data-sequence-rendered'
            ) === 'true'
        ) {
            return container.querySelector('svg');
        }

        var current =
            global.MIGMessageExchange &&
                typeof global.MIGMessageExchange.getCurrent ===
                'function'
                ? global.MIGMessageExchange.getCurrent()
                : null;

        if (!current) {
            return null;
        }

        var lang = options.lang || current.lang || 'en';
        var data = options.data || current.data || {};
        var source = buildSource(
            detail.useCase,
            data,
            lang
        );

        if (!source) {
            return null;
        }

        container.innerHTML = '';

        try {
            if (
                !global.Diagram ||
                typeof global.Diagram.parse !== 'function'
            ) {
                throw new Error(
                    'js-sequence-diagrams is not loaded.'
                );
            }

            var diagram = global.Diagram.parse(source);

            diagram.drawSVG(
                container,
                {
                    theme:
                        options.theme ||
                        document.body.getAttribute(
                            'data-sequence-theme'
                        ) ||
                        'simple',

                    css_class:
                        'message-exchange-sequence',

                    'font-family': 'Open Sans',
                    'font-size': 14
                }
            );

            container.setAttribute(
                'data-sequence-rendered',
                'true'
            );

            return container.querySelector('svg');
        } catch (error) {
            container.innerHTML = '';

            container.removeAttribute('aria-hidden');

            var warning = document.createElement('div');

            warning.className = 'alert alert-warning';

            warning.setAttribute('role', 'alert');
            warning.setAttribute('aria-atomic', 'true');

            warning.textContent = t('messageExchangePage.sequenceRenderError');

            container.appendChild(warning);

            return null;
        }
    }

    function renderWhileCollapsed(detail) {
        if (!detail || !detail.container) {
            return null;
        }

        var container = detail.container;

        if (
            container.getAttribute(
                'data-sequence-rendered'
            ) === 'true'
        ) {
            return container.querySelector('svg');
        }

        var collapse = container.closest
            ? container.closest('.message-exchange-case-collapse')
            : null;

        if (!collapse) {
            return render(detail);
        }

        /*
         * The outer case card is visible even though its collapse
         * body is not, so it gives us a sensible measurement width.
         */
        var casePanel = collapse.closest
            ? collapse.closest('.message-exchange-case')
            : null;

        var width = casePanel
            ? casePanel.getBoundingClientRect().width
            : 0;

        /*
         * Preserve absolutely everything Bootstrap may already have
         * placed in the style attribute.
         */
        var originalStyle =
            collapse.getAttribute('style');

        try {
            /*
             * Make the REAL collapse body participate in layout,
             * but keep it completely invisible and outside normal flow.
             *
             * Snap can now measure text/getBBox correctly.
             */
            collapse.style.display = 'block';
            collapse.style.position = 'absolute';
            collapse.style.visibility = 'hidden';
            collapse.style.pointerEvents = 'none';
            collapse.style.height = 'auto';
            collapse.style.overflow = 'visible';

            if (width > 0) {
                collapse.style.width = width + 'px';
            }

            return render(detail);
        } finally {
            /*
             * Put the collapse element exactly back the way Bootstrap
             * found it. Bootstrap's own show() method then continues.
             */
            if (originalStyle == null) {
                collapse.removeAttribute('style');
            } else {
                collapse.setAttribute(
                    'style',
                    originalStyle
                );
            }
        }
    }

    function onCaseShowing(event) {
        if (!event || !event.detail) {
            return;
        }

        renderWhileCollapsed(event.detail);
    }

    function onCaseShown(event) {
        if (!event || !event.detail) {
            return;
        }

        /*
         * Usually already rendered during "show".
         *
         * This remains necessary for Case 1 / a case that was
         * initially open when the page was constructed, because
         * Bootstrap never fires show.bs.collapse for that.
         */
        render(event.detail);
    }

    global.addEventListener(
        'mig:usecase:showing',
        onCaseShowing
    );

    global.addEventListener(
        'mig:usecase:shown',
        onCaseShown
    );

    global.MIGMessageExchangeSequence = {
        buildSource: buildSource,
        render: render
    };
}(window));
