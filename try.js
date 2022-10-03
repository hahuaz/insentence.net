/**
 * Template Name: HeroBiz - v2.2.0
 * Template URL: https://bootstrapmade.com/herobiz-bootstrap-business-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 10
        ? selectHeader.classList.add('sticked')
        : selectHeader.classList.remove('sticked');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar .scrollto');

  function navbarlinksActive() {
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY;
      if (navbarlink.hash != '#header') position += 200;

      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Function to scroll to an element with top ofset
   */
  function scrollto(el) {
    const selectHeader = document.querySelector('#header');
    let offset = 0;

    if (selectHeader.classList.contains('sticked')) {
      offset = document.querySelector('#header.sticked').offsetHeight;
    } else if (selectHeader.hasAttribute('data-scrollto-offset')) {
      offset =
        selectHeader.offsetHeight -
        parseInt(selectHeader.getAttribute('data-scrollto-offset'));
    }
    window.scrollTo({
      top: document.querySelector(el).offsetTop - offset,
      behavior: 'smooth',
    });
  }

  /**
   * Fires the scrollto function on click to links .scrollto
   */
  let selectScrollto = document.querySelectorAll('.scrollto');
  selectScrollto.forEach((el) =>
    el.addEventListener('click', function (event) {
      if (document.querySelector(this.hash)) {
        event.preventDefault();

        let mobileNavActive = document.querySelector('.mobile-nav-active');
        if (mobileNavActive) {
          mobileNavActive.classList.remove('mobile-nav-active');

          let navbarToggle = document.querySelector('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        scrollto(this.hash);
      }
    })
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Mobile nav toggle
   */
  const mobileNavToogle = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToogle) {
    mobileNavToogle.addEventListener('click', function (event) {
      event.preventDefault();

      document.querySelector('body').classList.toggle('mobile-nav-active');

      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach((el) => {
    el.addEventListener('click', function (event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    });
  });

  /**
   * Auto generate the hero carousel indicators
   */
  let heroCarouselIndicators = document.querySelector(
    '#hero .carousel-indicators'
  );
  if (heroCarouselIndicators) {
    let heroCarouselItems = document.querySelectorAll('#hero .carousel-item');

    heroCarouselItems.forEach((item, index) => {
      if (index === 0) {
        heroCarouselIndicators.innerHTML += `<li data-bs-target="#hero" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        heroCarouselIndicators.innerHTML += `<li data-bs-target="#hero" data-bs-slide-to="${index}"></li>`;
      }
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function () {
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    };
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener(
      'click',
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    );
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {
    let portfolioFilter = portfolionIsotope.getAttribute(
      'data-portfolio-filter'
    )
      ? portfolionIsotope.getAttribute('data-portfolio-filter')
      : '*';
    let portfolioLayout = portfolionIsotope.getAttribute(
      'data-portfolio-layout'
    )
      ? portfolionIsotope.getAttribute('data-portfolio-layout')
      : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort')
      ? portfolionIsotope.getAttribute('data-portfolio-sort')
      : 'original-order';

    window.addEventListener('load', () => {
      let portfolioIsotope = new Isotope(
        document.querySelector('.portfolio-container'),
        {
          itemSelector: '.portfolio-item',
          layoutMode: portfolioLayout,
          filter: portfolioFilter,
          sortBy: portfolioSort,
        }
      );

      let menuFilters = document.querySelectorAll(
        '.portfolio-isotope .portfolio-flters li'
      );
      menuFilters.forEach(function (el) {
        el.addEventListener(
          'click',
          function () {
            document
              .querySelector(
                '.portfolio-isotope .portfolio-flters .filter-active'
              )
              .classList.remove('filter-active');
            this.classList.add('filter-active');
            portfolioIsotope.arrange({
              filter: this.getAttribute('data-filter'),
            });
            if (typeof aos_init === 'function') {
              aos_init();
            }
          },
          false
        );
      });
    });
  }

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80,
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120,
      },
    },
  });

  /**
   * Testimonials Slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });

  /**
   * Testimonials Slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });
});

//Pronounce

function pronounce() {
  var text = $('#main-sentence').text(),
    msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg),
    (msg.onend = function (event) {
      location.reload();
    });
}
$('#accordion a').click(function (event) {
  event.preventDefault();
  var parentId = $(this).attr('data-parent'),
    href = $(this).attr('href'),
    allLink = $(parentId).find('a');
  allLink.attr('aria-expanded', !1),
    $(this).attr('aria-expanded', !0),
    allLink.find('.fa-minus').removeClass('fa-minus').addClass('fa-plus'),
    $(this).find('.fa-plus').removeClass('fa-plus').addClass('fa-minus'),
    $(parentId).find('.collapse').slideUp(),
    $(href).stop(!0, !1).slideDown();
}),
  $('.mu-menu-btn').click(function (event) {
    event.preventDefault(),
      $('.mu-menu-full-overlay').addClass('mu-menu-full-overlay-show');
  }),
  $('.mu-menu-close-btn').click(function (event) {
    event.preventDefault(),
      $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');
  }),
  $('.mu-menu a').click(function (event) {
    event.preventDefault(),
      $('.mu-menu-full-overlay').removeClass('mu-menu-full-overlay-show');
  }),
  $('.mu-menu a').click(function (event) {
    event.preventDefault();
    var dest = 0;
    (dest =
      $(this.hash).offset().top > $(document).height() - $(window).height()
        ? $(document).height() - $(window).height()
        : $(this.hash).offset().top),
      $('html,body').animate({ scrollTop: dest }, 1e3, 'swing');
  }),
  $('p i.fa-volume-up').click(function () {
    var text = $(this).siblings('span').text(),
      msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }),
  $('#search-input-btn').click(function (event) {
    var val = $(this).siblings('input').val();
    window.open(
      location.origin + '/' + val + '-in-english-words-and-spelling',
      '_blank'
    );
  });

//copy text button

var copy = document.querySelectorAll('.copy');

for (const copied of copy) {
  copied.onclick = function () {
    document.execCommand('copy');
  };
  copied.addEventListener('copy', function (event) {
    event.preventDefault();
    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', copied.textContent);
      console.log(event.clipboardData.getData('text'));
    }
  });
}

//COOKIEs

(function ($) {
  $.cookit = function (options) {
    var settings = $.extend(
      {
        backgroundColor: '#56556b',
        messageColor: '#fff',
        linkColor: '#fad04c',
        buttonColor: '#fad04c',
        messageText:
          '<b>This website uses cookies.</b> By continuing to visit this website you agree to our use of cookies.',
        linkText: 'Read our cookie Policy',
        linkUrl: 'https://www.translateen.com/cookie-policy/',
        buttonText: 'GOT IT',
      },
      options
    );

    const banner = $("<div id='cookit'></div>");
    const container = $("<div id='cookit-container'></div>");
    var message = (link = button = null);
    const hasCookieConsent = getCookie('cookies-consent');

    if (!hasCookieConsent) {
      createBanner(settings);
      $('#cookit-button').on('click', () => {
        const cookieBanner = $('#cookit');
        cookieBanner.addClass('hidden');
        setCookie('cookies-consent', 1, 365);
      });
    }

    function createBanner() {
      message = $("<p id='cookit-message'>" + settings.messageText + '</p>');
      link = $(
        "<a id='cookit-link' href='" +
          settings.linkUrl +
          "' target='_blank'>" +
          settings.linkText +
          '</a>'
      );
      button = $(
        "<a id='cookit-button' href='#'>" + settings.buttonText + '</a>'
      );

      $('body').append(banner);
      banner.append(container);
      container.append(message);
      container.append(link);
      container.append(button);

      customize();
    }

    function customize() {
      banner.css({ 'background-color': settings.backgroundColor });
      message.css({ color: settings.messageColor });
      link.css({ color: settings.linkColor });
      button.css({
        'background-color': settings.buttonColor,
        color: settings.backgroundColor,
      });
    }

    function getCookie(name) {
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      name = name + '=';

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
    }

    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = 'expires=' + date.toUTCString();
      document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }
  };
})(jQuery);
