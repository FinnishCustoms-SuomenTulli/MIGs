(function (global) {
    'use strict';

    var t = global.MIGUtils.t;
    var loadJson = global.MIGUtils.loadJson;
    var localized = global.MIGUtils.localized;

    /*
     * Constraint descriptions contain:
     *
     *   <i>Goods item</i>
     *
     * but also literal placeholders:
     *
     *   <Decisive Date>
     *
     * Therefore we cannot use innerHTML. This function recognizes
     * only opening and closing <i> tags. Everything else remains text.
     */
    function appendConstraintContent(target, value) {
        var text = String(value || '');

        /*
         * Only these explicitly supported tags become HTML.
         * Everything else, including <TPendDate> and
         * <Decisive Date>, remains ordinary text.
         */
        var tokenPattern =
            /<\/?(?:i|ul|li)>|<br\s*\/?>/gi;

        var stack = [
            {
                tag: null,
                node: target
            }
        ];

        var lastIndex = 0;
        var match;

        function currentNode() {
            return stack[stack.length - 1].node;
        }

        function appendText(textValue) {
            if (!textValue) return;

            currentNode().appendChild(
                document.createTextNode(textValue)
            );
        }

        function closeTag(tagName, originalToken) {
            var index;

            /*
             * Find the matching open element. This is slightly more
             * defensive than assuming that all source markup is perfect.
             */
            for (
                index = stack.length - 1;
                index > 0;
                index -= 1
            ) {
                if (stack[index].tag === tagName) {
                    stack.length = index;
                    return;
                }
            }

            /*
             * No matching opening tag: preserve the token as text.
             */
            appendText(originalToken);
        }

        while ((match = tokenPattern.exec(text)) !== null) {
            appendText(
                text.slice(lastIndex, match.index)
            );

            var token = match[0];
            var normalizedToken = token
                .toLowerCase()
                .replace(/\s+/g, '');

            if (/^<br\/?>$/.test(normalizedToken)) {
                currentNode().appendChild(
                    document.createElement('br')
                );
            } else if (
                normalizedToken.indexOf('</') === 0
            ) {
                var closingTag = normalizedToken
                    .slice(2, -1);

                closeTag(closingTag, token);
            } else {
                var openingTag = normalizedToken
                    .slice(1, -1);

                var element =
                    document.createElement(openingTag);

                currentNode().appendChild(element);

                stack.push({
                    tag: openingTag,
                    node: element
                });
            }

            lastIndex = tokenPattern.lastIndex;
        }

        appendText(text.slice(lastIndex));
    }

    function findConstraint(data, constraintId) {
        if (
            !data ||
            typeof data !== 'object' ||
            !Object.prototype.hasOwnProperty.call(
                data,
                constraintId
            )
        ) {
            return null;
        }

        return data[constraintId];
    }

    function normalizeConstraint(data, constraintId, lang) {
        var source = findConstraint(data, constraintId);

        if (!source) {
            return null;
        }

        var description = localized(
            source,
            lang,
            ''
        );

        if (!description) {
            return null;
        }

        return {
            id: constraintId,
            description: description,
            source: source
        };
    }

    function renderConstraint(data, target, options) {
        options = options || {};

        if (!target) {
            return null;
        }

        target.innerHTML = '';

        var constraintId =
            options.constraintId ||
            options.id ||
            '';

        var lang = options.lang || 'en';

        var constraint = normalizeConstraint(
            data,
            constraintId,
            lang
        );

        if (!constraint) {
            target.textContent =
                t('dataRequirements.constraintModal.notFound') +
                ' ' +
                constraintId;

            return null;
        }

        var description = document.createElement('div');

        description.className =
            'data-requirements-constraint-description';

        appendConstraintContent(
            description,
            constraint.description
        );

        target.appendChild(description);

        return constraint;
    }

    function loadConstraint(url, target, options) {
        options = options || {};

        return loadJson(url).then(function (data) {
            return renderConstraint(
                data,
                target,
                options
            );
        });
    }

    global.MIGConstraintRenderer = {
        loadConstraint: loadConstraint,
        renderConstraint: renderConstraint
    };
})(window);