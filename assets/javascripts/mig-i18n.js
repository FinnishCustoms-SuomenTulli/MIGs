(function (global) {
    'use strict';

    function getByPath(obj, path) {
        return String(path || '').split('.').reduce(function (current, part) {
            return current && Object.prototype.hasOwnProperty.call(current, part)
                ? current[part]
                : undefined;
        }, obj);
    }

    function currentLang() {
        return (document.body && document.body.dataset && document.body.dataset.lang) ||
            document.documentElement.lang ||
            'en';
    }

    var lang = currentLang();
    var scriptUrl = document.currentScript ? document.currentScript.src : '';
    var i18nUrl = scriptUrl
        ? new URL('../i18n/' + lang + '.json', scriptUrl).toString()
        : '../../assets/i18n/' + lang + '.json';

    var api = global.MIG_I18N = global.MIG_I18N || {};

    function requireTranslation(path) {
        var value = getByPath(api.dict, path);

        if (value === undefined || value === null) {
            throw new Error(
                'Missing translation "' + path + '" for language "' + api.lang + '".'
            );
        }

        return value;
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            var value = String(requireTranslation(element.getAttribute('data-i18n')));

            if (element.hasAttribute('data-i18n-prefix')) {
                value = element.getAttribute('data-i18n-prefix') + value;
            }

            if (element.hasAttribute('data-i18n-suffix')) {
                value += element.getAttribute('data-i18n-suffix');
            }

            element.textContent = value;
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (element) {
            element.innerHTML = String(
                requireTranslation(element.getAttribute('data-i18n-html'))
            );
        });

        ['alt', 'title', 'placeholder', 'aria-label'].forEach(function (attr) {
            document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (element) {
                element.setAttribute(
                    attr,
                    String(requireTranslation(element.getAttribute('data-i18n-' + attr)))
                );
            });
        });
    }

    function updateLanguageLinks() {
        var suffix = global.location.search + global.location.hash;

        Array.prototype.forEach.call(
            document.querySelectorAll('[data-lang-option]'),
            function (link) {
                var linkLang = link.getAttribute('data-lang-option');

                if (linkLang === api.lang) {
                    link.hidden = true;
                    link.setAttribute('aria-hidden', 'true');
                    link.setAttribute('tabindex', '-1');
                    return;
                }

                link.hidden = false;
                link.removeAttribute('aria-hidden');
                link.removeAttribute('tabindex');

                var href = link.getAttribute('href');
                if (!href) return;

                var cleanHref = href.split('?')[0].split('#')[0];
                link.setAttribute('href', cleanHref + suffix);
            }
        );
    }

    api.lang = lang;
    api.dict = {};
    api.t = requireTranslation;
    api.apply = function () {
        applyI18n();
        updateLanguageLinks();
    };
    api.updateLanguageLinks = updateLanguageLinks;

    api.readyPromise = fetch(i18nUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    'Could not load translation file ' + i18nUrl + ': ' +
                    response.status + ' ' + response.statusText
                );
            }

            return response.json();
        })
        .then(function (dict) {
            api.dict = dict;
            api.apply();
            return dict;
        })
        .catch(function (error) {
            console.error(error);
            throw error;
        });

    api.ready = function (callback) {
        return api.readyPromise.then(function () {
            return callback(api.t, api.lang, api.dict);
        });
    };
})(window);
