(function (global) {
  'use strict';

  function addToTopButton(label) {
    if (document.body.getAttribute('data-to-top') === 'false' || document.getElementById('toTop')) return;

    var button = document.createElement('button');
    var icon = document.createElement('i');

    button.id = 'toTop';
    button.className = 'badge';
    button.type = 'button';
    button.setAttribute('aria-label', label);
    icon.className = 'media-object icon-md icon icon-tulli-arrow-up';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);
    document.body.appendChild(button);

    function syncVisibility() { button.style.display = global.scrollY !== 0 ? 'block' : 'none'; }

    global.addEventListener('scroll', syncVisibility, { passive: true });
    button.addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });
    syncVisibility();
  }

  function tableResponsive() {
    Array.prototype.forEach.call(document.querySelectorAll('table'), function (table, tableIndex) {
      table.classList.add('table-' + tableIndex);

      Array.prototype.forEach.call(table.querySelectorAll('th'), function (header, thIndex) {
        var headerText = header.textContent.trim();
        header.classList.add('table-header-' + tableIndex + thIndex);

        Array.prototype.forEach.call(table.querySelectorAll('tr td:nth-of-type(' + (thIndex + 1) + ')'), function (cell) {
          cell.setAttribute('data-header', headerText);
        });
      });
    });
  }

  function syncFrontPageSidebarHeight() {
    var navigationBody = document.querySelector('.front-navigation > .card-body');
    var sidebarBox = document.querySelector('.sidebar-box');

    if (!navigationBody || !sidebarBox || sidebarBox.dataset.expanded === 'true') return;

    var height = Math.ceil(navigationBody.getBoundingClientRect().height);
    if (!height) return;

    sidebarBox.style.height = height + 'px';
    sidebarBox.style.maxHeight = height + 'px';
    sidebarBox.style.overflow = 'hidden';
    syncVersionHistoryAccessibility(sidebarBox);
  }

  function syncVersionHistoryAccessibility(sidebarBox) {
    if (!sidebarBox || sidebarBox.dataset.expanded === 'true') return;

    var readMore = sidebarBox.querySelector('.read-more');
    if (!readMore) return;

    var visibleBottom = readMore.getBoundingClientRect().top;

    sidebarBox.querySelectorAll('tbody tr').forEach(function (row) {
      var isClipped = row.getBoundingClientRect().bottom > visibleBottom;

      if (isClipped) row.setAttribute('aria-hidden', 'true');
      else row.removeAttribute('aria-hidden');

      row.querySelectorAll('a, button').forEach(function (control) {
        if (isClipped) control.setAttribute('tabindex', '-1');
        else control.removeAttribute('tabindex');
      });
    });
  }

  function scheduleSidebarHeightSync() { global.requestAnimationFrame(syncFrontPageSidebarHeight); }

  function initFrontPageSidebarHeightSync() {
    var navigationBody = document.querySelector('.front-navigation > .card-body');
    if (!navigationBody || !document.querySelector('.sidebar-box')) return;

    scheduleSidebarHeightSync();
    global.addEventListener('load', scheduleSidebarHeightSync);
    global.addEventListener('resize', scheduleSidebarHeightSync);
    if (global.ResizeObserver) new global.ResizeObserver(scheduleSidebarHeightSync).observe(navigationBody);
  }

  function initBootstrapComponents() {
    if (!global.bootstrap) return;

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (element) {
      global.bootstrap.Tooltip.getOrCreateInstance(element);
    });

    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (element) {
      global.bootstrap.Popover.getOrCreateInstance(element);
    });

    if (document.querySelector('.sidebar nav')) global.bootstrap.ScrollSpy.getOrCreateInstance(document.body, { target: '.sidebar nav' });
  }

  function init() {
    global.MIG_I18N.ready(function (t) { addToTopButton(t('accessibility.backToTop')); });

    initBootstrapComponents();

    document.querySelectorAll('.current').forEach(function (element) {
      element.classList.remove('current');
      element.classList.add('active');
    });

    document.querySelectorAll('.navbar-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var icon = toggle.querySelector('.icon');
        if (!icon) return;
        icon.classList.toggle('icon-tulli-chevron-down');
        icon.classList.toggle('icon-tulli-arrow-up');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.MIG_I18N.ready(initFrontPageSidebarHeightSync);
})(window);
