(function (global, $) {
  'use strict';

  function addToTopButton(label) {
    if (document.body.getAttribute('data-to-top') === 'false') return;
    if (document.getElementById('toTop')) return;

    var button = $('<button>', {
      id: 'toTop',
      class: 'badge',
      type: 'button',
      'aria-label': label
    });

    button.append(
      $('<i>', {
        class: 'media-object icon-md icon icon-tulli-arrow-up',
        'aria-hidden': 'true'
      })
    );

    $('body').append(button);

    $(global).on('scroll.toTopButton', function () {
      if ($(this).scrollTop() !== 0) {
        $('#toTop').fadeIn();
      } else {
        $('#toTop').fadeOut();
      }
    });

    $('#toTop').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
      return false;
    });

    $(global).triggerHandler('scroll.toTopButton');
  }

  function tableResponsive() {
    $('table').each(function (tableIndex) {
      var table = $(this);
      var tableClass = 'table-' + tableIndex;

      table.addClass(tableClass);

      table.find('th').each(function (thIndex) {
        var header = $(this);
        var headerText = $.trim(header.text());

        header.addClass('table-header-' + tableIndex + thIndex);
        table.find('tr td:nth-of-type(' + (thIndex + 1) + ')')
          .attr('data-header', headerText);
      });
    });
  }

  function syncFrontPageSidebarHeight() {
    var navigationBody = document.querySelector('.front-navigation .panel-body');
    var sidebarBox = document.querySelector('.sidebar-box');

    if (!navigationBody || !sidebarBox) return;
    if (sidebarBox.dataset.expanded === 'true') return;

    var height = Math.ceil(navigationBody.getBoundingClientRect().height);
    if (!height) return;

    sidebarBox.style.height = height + 'px';
    sidebarBox.style.maxHeight = height + 'px';
    sidebarBox.style.overflow = 'hidden';

    syncVersionHistoryAccessibility(
      sidebarBox
    );
  }

  function syncVersionHistoryAccessibility(sidebarBox) {
    if (!sidebarBox || sidebarBox.dataset.expanded === 'true') {
      return;
    }

    var readMore = sidebarBox.querySelector('.read-more');

    if (!readMore) {
      return;
    }

    // The top edge of the fade is our accessibility boundary.

    var visibleBottom = readMore.getBoundingClientRect().top;

    sidebarBox.querySelectorAll('tbody tr').forEach(function (row) {
      var isClipped = row.getBoundingClientRect().bottom > visibleBottom;

      if (isClipped) {
        row.setAttribute('aria-hidden', 'true');
      } else {
        row.removeAttribute('aria-hidden');
      }

      row.querySelectorAll('a, button').forEach(function (control) {
        if (isClipped) {
          control.setAttribute('tabindex', '-1');
        } else {
          control.removeAttribute('tabindex');
        }
      });
    });
  }

  function scheduleSidebarHeightSync() {
    global.requestAnimationFrame(syncFrontPageSidebarHeight);
  }

  function initFrontPageSidebarHeightSync() {
    var navigationBody = document.querySelector('.front-navigation .panel-body');
    if (!navigationBody || !document.querySelector('.sidebar-box')) return;

    scheduleSidebarHeightSync();
    global.addEventListener('load', scheduleSidebarHeightSync);
    global.addEventListener('resize', scheduleSidebarHeightSync);

    if (global.ResizeObserver) {
      new global.ResizeObserver(scheduleSidebarHeightSync).observe(navigationBody);
    }
  }

  $(function () {
    global.MIG_I18N.ready(function (t) {
      addToTopButton(
        t('accessibility.backToTop')
      );
    });

    $('[data-toggle="offcanvas"]').on('click', function () {
      $('.row-offcanvas').toggleClass('active');
    });

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    $('body').scrollspy({ target: '.sidebar nav' });

    var navArea = $('.sidebar .nav-stacked');

    function syncStickyNavigationWidth() {
      if (!navArea.length) return;

      var parent = navArea.parent();
      var width;

      parent.removeAttr('style');

      if (parent.hasClass('affix')) {
        width = parseInt($('nav .nav-stacked').parent().width(), 10) - 20;
      } else {
        width = navArea.width();
      }

      parent.css('width', width);
    }

    syncStickyNavigationWidth();

    if ($(global).width() < 767) {
      tableResponsive();
    }

    $(global).on('resize.migCustomUi', function () {
      syncStickyNavigationWidth();

      if ($(global).width() < 767) {
        tableResponsive();
      }
    });

    $('.current').removeClass('current').addClass('active');

    $('.navbar-toggle').on('click key tap', function () {
      $(this).find('.icon')
        .toggleClass('icon-tulli-chevron-down')
        .toggleClass('icon-tulli-arrow-up');
    });
  });

  global.MIG_I18N.ready(initFrontPageSidebarHeightSync);
})(window, window.jQuery);
