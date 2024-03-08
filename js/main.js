/*
 * Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function($) {

    'use strict';

    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        $('.popover-dismiss').popover({
            trigger: 'focus'
        })
    });


    function bottomPos(element) {
        return element.offset().top + element.outerHeight();
    }

    // Bootstrap Fixed Header
    $(function() {
        var promo = $(".js-td-cover");
        if (!promo.length) {
            return
        }

        var promoOffset = bottomPos(promo);
        var navbarOffset = $('.js-navbar-scroll').offset().top;

        var threshold = Math.ceil($('.js-navbar-scroll').outerHeight());
        if ((promoOffset - navbarOffset) < threshold) {
            $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
        }


        $(window).on('scroll', function() {
            var navtop = $('.js-navbar-scroll').offset().top - $(window).scrollTop();
            var promoOffset = bottomPos($('.js-td-cover'));
            var navbarOffset = $('.js-navbar-scroll').offset().top;
            if ((promoOffset - navbarOffset) < threshold) {
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
            } else {
                $('.js-navbar-scroll').removeClass('navbar-bg-onscroll');
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');
            }
        });
    });


}(jQuery));

;
(function ($) {
  'use strict';
  const breakpoint = 1200;

  // Accessibility for desktop main menu items
  $(function () {
    function goToLastItemInSubmenu(navItem) {
      let stack = [$(navItem)];

      while (stack.length) {
        const currentLiChildren = stack.pop();
        $(currentLiChildren).addClass("submenu-open");
        $(currentLiChildren).find("> a").attr("aria-expanded", "true");

        const lastChildrenLi = $(currentLiChildren).find("> ul > li.has-children").last();
        if ($(lastChildrenLi).is($(currentLiChildren).find("> ul > li").last())) {
          stack.push(lastChildrenLi);
        }
      }

      $(navItem).find(".nav-link").last().focus();
    }

    const mainMenuLinks = $('.td-navbar .navbar-nav > li > a');

    // on tab, if hovers over any nav-link in main menu
    $(mainMenuLinks).bind('keydown', function (event) {
      const navItem = $(this).closest(".nav-item");
      const prevNavItem = $(navItem).prev();

      // if tabbing backward
      if (event.shiftKey && event.key.toUpperCase() === "TAB") {

        // if prev item has submenu
        if ($(prevNavItem).length && $(prevNavItem).hasClass("has-children")) {
          event.preventDefault();
          goToLastItemInSubmenu(prevNavItem);
          return;
        }

        // if prev item doesn't have submenu
        if ($(prevNavItem).length && !$(prevNavItem).hasClass("has-children")) {
          $(navItem).find("li.has-children").removeClass("submenu-open");
          $(navItem).find("a[aria-expanded]").attr("aria-expanded", "false");
        }

      // if tabbing forward
      } else if (event.key.toUpperCase() === "TAB") {

        // if it's an item with submenu
        if ($(navItem).hasClass("has-children")) {
          $(navItem).addClass("submenu-open");
          $(navItem).find("> a").attr("aria-expanded", "true");
          return;
        }
      }
    });
  });

  // Accessibility for desktop submenu items
  $(function () {
    function closeSubmenu(currentLi) {
      // if all submenus closed
      if (!$(currentLi).parent().hasClass("dropdown-menu")) {
        return;
       }

      // if current li is not the last in submenu
      if (!$(currentLi).is(":last-child")) {
       return;
      }

      const nextLi = $(currentLi).parent().closest("li.has-children");
      $(nextLi).find("a[aria-expanded]").attr("aria-expanded", "false");
      nextLi.removeClass("submenu-open");
      closeSubmenu(nextLi);
    }

    const subMenuLinks = $('.td-navbar .dropdown-menu > li > a');

    $(subMenuLinks).bind('keydown', function (event) {
      const navItem = $(this).closest(".nav-item");
      const prevNavItem = $(navItem).prev();
      const nextNavItem = $(navItem).next();

      // if tabbing backward
      if (event.shiftKey && event.key.toUpperCase() === "TAB") {

        // if current is first item in submenu
        if (!$(prevNavItem).length) {
          $(navItem).parent().closest(".nav-item").removeClass("submenu-open");
          $(navItem).parent().closest(".nav-item").find("a[aria-expanded]").attr("aria-expanded", "false");
          return;
        }

        // if prev item has submenu
        if ($(prevNavItem).hasClass("has-children")) {
          $(prevNavItem).addClass("submenu-open");
          $(prevNavItem).find("> a").attr("aria-expanded", "true");
          return;
        }

        // if prev item doesn't have submenu
        if (!$(prevNavItem).hasClass("has-children")) {
          $(navItem).parent("ul").find("li.has-children").removeClass("submenu-open");
          $(navItem).find("a[aria-expanded]").attr("aria-expanded", "false");
          return;
        }

      // if tabbing forward
      } else if (event.key.toUpperCase() === "TAB") {
        // if current item has submenu
        if ($(navItem).hasClass("has-children")) {
          $(navItem).addClass("submenu-open");
          $(navItem).find("> a").attr("aria-expanded", "true");
          return;
        }

        // if next item is none
        if ($(nextNavItem).length === 0) {
          closeSubmenu(navItem);
          return;
        }
      }
    });
  })

  function closeMobileMenu(body, header, mobileMenuBtn, mobileMenu) {
    $(body).removeClass('mobile-menu-open');
    $(header).removeClass('mobile-menu-open');
    $(mobileMenuBtn).attr('aria-label', 'Open mobile menu').removeClass("open").attr('aria-expanded', 'false');
    $(mobileMenu).find(".nav-submenu-btn").removeClass("open").attr('aria-label', 'Open submenu').attr('aria-expanded', 'false');
    $(mobileMenu).find("> ul > li > .navbar-submenu").slideUp();
    $(mobileMenu).find(".nav-item").removeClass("submenu-open");
    $(mobileMenu).find(".td-search-input").val("");
  }

  // Show or hide mobile menu
  $(function () {
    const body = $('body');
    const header = $('header');
    const mobileMenuBtn = $(header).find('.navbar-mobile-button').first();
    const mobileMenu = $('.td-navbar-mobile');

    $(mobileMenuBtn).click(() => {
      mobileMenuBtn.toggleClass("open");

      if (mobileMenuBtn.hasClass("open")) {
        body.addClass('mobile-menu-open');
        header.addClass('mobile-menu-open');
        mobileMenuBtn.attr('aria-label', 'Close mobile menu').attr('aria-expanded', 'true');
      } else {
        closeMobileMenu(body, header, mobileMenuBtn, mobileMenu)
      }
    })
  });

  // Remove mobile menu after breakpoint in window.width
  $(function () {
    const body = $('body');
    const header = $('header');
    const mobileMenuBtn = $(header).find('.navbar-mobile-button').first();
    const mobileMenu = $('.td-navbar-mobile');

    $(window).resize(() => {
      if ($(document).width() > breakpoint) {
        closeMobileMenu(body, header, mobileMenuBtn, mobileMenu)
      }
    });
  });

  // Expand / collapse submenu on clicking chevron
  $(function () {
    $(".nav-submenu-btn").click(function(e) {
      e.preventDefault();
      const navItem = $(this).closest(".nav-item");
      $(navItem).toggleClass("submenu-open");

      if ($(navItem).hasClass("submenu-open")) {
        $("ul:first", navItem).slideDown();
        $(navItem).find("> a > .nav-submenu-btn").attr('aria-label', 'Close submenu').attr("aria-expanded", "true");
      } else {
        $("ul:first", navItem).slideUp();
        $(navItem).find("> a > .nav-submenu-btn").attr('aria-label', 'Open submenu').attr("aria-expanded", "false");
      }
    })
  });
}(jQuery));

;
(function ($) {
  $(function () {
    // on tab, if clicking a button with '.btn-link-down' class
    const headerHeightDesktop = 80;
    const headerHeightMobile = 64;
    const viewBreakpoint = 991;
    const offset = 0;
    const animationDelay = 0;

    $(".btn-link-down").click(function (event) {
      let target;
      const targetId = $(this).attr("data-target-id");

      if ($(`#${targetId}`).length === 0) return;

      if ($(window).width() < viewBreakpoint) {
        target = $(`#${targetId}`).offset().top - headerHeightMobile - offset;
      } else {
        target = $(`#${targetId}`).offset().top - headerHeightDesktop - offset;
      }

      $("html").stop(true).animate({scrollTop: target}, animationDelay);
    });
  });
}(jQuery));

;
/*
 * Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function ($) {
    'use strict';

    // Headers' anchor link that shows on hover
    $(function () {
        // append anchor links to headings in markdown.
        var article = document.getElementsByTagName('main')[0];
        if (!article) {
            return;
        }
        var headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(function (heading) {
            if (heading.id) {
                var a = document.createElement('a');
                // set visibility: hidden, not display: none to avoid layout change
                a.style.visibility = 'hidden';
                // [a11y] hide this from screen readers, etc..
                a.setAttribute('aria-hidden', 'true');
                // material insert_link icon in svg format
                a.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';
                a.href = '#' + heading.id;
                heading.insertAdjacentElement('beforeend', a);
                heading.addEventListener('mouseenter', function () {
                    a.style.visibility = 'initial';
                });
                heading.addEventListener('mouseleave', function () {
                    a.style.visibility = 'hidden';
                });
            }
        });
    });

}(jQuery));

;
// Adapted from code by Matt Walters https://www.mattwalters.net/posts/hugo-and-lunr/

(function($) {
    'use strict';

    $(document).ready(function() {
        const $searchInput = $('.td-search-input');

        //
        // Options for popover
        //

        $searchInput.data('html', true);
        $searchInput.data('placement', 'bottom');

        //
        // Register handler
        //

        $searchInput.on('change', event => {
            render($(event.target));

            // Hide keyboard on mobile browser
            $searchInput.blur();
        });

        // Prevent reloading page by enter key on sidebar search.
        $searchInput.closest('form').on('submit', () => {
            return false;
        });

        //
        // Lunr
        //

        let idx = null; // Lunr index
        const resultDetails = new Map(); // Will hold the data for the search results (titles and summaries)

        // Set up for an Ajax call to request the JSON data file that is created by Hugo's build process
        $.ajax($searchInput.data('offline-search-index-json-src')).then(
            data => {
                idx = lunr(function() {
                    this.ref('ref');
                    this.field('title', { boost: 2 });
                    this.field('body');

                    data.forEach(doc => {
                        this.add(doc);

                        resultDetails.set(doc.ref, {
                            title: doc.title,
                            excerpt: doc.excerpt
                        });
                    });
                });

                $searchInput.trigger('change');
            }
        );

        const render = $targetSearchInput => {
            // Dispose the previous result
            $targetSearchInput.popover('dispose');

            //
            // Search
            //

            if (idx === null) {
                return;
            }

            const searchQuery = $targetSearchInput.val();
            if (searchQuery === '') {
                return;
            }

            const results = idx
                .query(q => {
                    const tokens = lunr.tokenizer(searchQuery.toLowerCase());
                    tokens.forEach(token => {
                        const queryString = token.toString();
                        q.term(queryString, {
                            boost: 100
                        });
                        q.term(queryString, {
                            wildcard:
                                lunr.Query.wildcard.LEADING |
                                lunr.Query.wildcard.TRAILING,
                            boost: 10
                        });
                        q.term(queryString, {
                            editDistance: 2
                        });
                    });
                })
                .slice(0, 10);

            //
            // Make result html
            //

            const $html = $('<div>');

            $html.append(
                $('<div>')
                    .css({
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1em'
                    })
                    .append(
                        $('<span>')
                            .text('Search results')
                            .css({ fontWeight: 'bold' })
                    )
                    .append(
                        $('<i>')
                            .addClass('fas fa-times search-result-close-button')
                            .css({
                                cursor: 'pointer'
                            })
                    )
            );

            const $searchResultBody = $('<div>').css({
                maxHeight: `calc(100vh - ${$targetSearchInput.offset().top +
                    180}px)`,
                overflowY: 'auto'
            });
            $html.append($searchResultBody);

            if (results.length === 0) {
                $searchResultBody.append(
                    $('<p>').text(`No results found for query "${searchQuery}"`)
                );
            } else {
                results.forEach(r => {
                    const $cardHeader = $('<div>').addClass('card-header');
                    const doc = resultDetails.get(r.ref);
                    const href =
                        $searchInput.data('offline-search-base-href') +
                        r.ref.replace(/^\//, '');

                    $cardHeader.append(
                        $('<a>')
                            .attr('href', href)
                            .text(doc.title)
                    );

                    const $cardBody = $('<div>').addClass('card-body');
                    $cardBody.append(
                        $('<p>')
                            .addClass('card-text text-muted')
                            .text(doc.excerpt)
                    );

                    const $card = $('<div>').addClass('card');
                    $card.append($cardHeader).append($cardBody);

                    $searchResultBody.append($card);
                });
            }

            $targetSearchInput.on('shown.bs.popover', () => {
                $('.search-result-close-button').on('click', () => {
                    $targetSearchInput.val('');
                    $targetSearchInput.trigger('change');
                });
            });

            $targetSearchInput
                .data('content', $html[0].outerHTML)
                .popover('show');
        };
    });
})(jQuery);
