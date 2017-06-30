var $screenSm = 768, $screenMd = 1024, $screenLg = 1280;

var $fontSizeRoot = 16, $fontSizeRootComputed = parseInt($('html').css('fontSize'));

var $screenSmMin = $screenSm/$fontSizeRoot + 'em'; console.log('$screenSmMin = ' + $screenSmMin + ' (' + $screenSm + 'px)');
var $screenMdMin = $screenMd/$fontSizeRoot + 'em'; console.log('$screenMdMin = ' + $screenMdMin + ' (' + $screenMd + 'px)');
var $screenLgMin = $screenLg/$fontSizeRoot + 'em'; console.log('$screenLgMin = ' + $screenLgMin + ' (' + $screenLg + 'px)');

var $screenXsMax = ($screenSm - 1)/$fontSizeRoot + 'em'; console.log('$screenXsMax = ' + $screenXsMax);
var $screenSmMax = ($screenMd - 1)/$fontSizeRoot + 'em'; console.log('$screenSmMax = ' + $screenSmMax);
var $screenMdMax = ($screenLg - 1)/$fontSizeRoot + 'em'; console.log('$screenMdMax = ' + $screenMdMax);

if('WebkitAppearance' in document.documentElement.style) {
    $('html').addClass('webkit');
}


$(function () {
    var $asideSlideout=$('.aside-slideout'), slideout;
    $(window).on('resize.asideSlideout', function () {
        if (Modernizr.mq('(max-width: ' + $screenSmMax + ')')) {
            $('.form-search').appendTo($asideSlideout);
            $('.menu').appendTo($asideSlideout);

            if (!$asideSlideout.hasClass('slideout-init')) {
                slideout = new Slideout({
                    'panel': document.querySelector('.wrapper'),
                    'menu': document.querySelector('.aside-slideout'),
                    'padding': 260,
                    'tolerance': 70
                });
                $asideSlideout.addClass('slideout-init');

                slideout.on('beforeopen', function() {
                    $('.header').css({'position': 'absolute', 'top': $(window).scrollTop()});
                }).on('translate', function(translated) {
                    $('.header').css({'position': 'absolute', 'top': $(window).scrollTop()});
                }).on('open', function() {
                    $('.header__toggle-menu').addClass('header__toggle-menu_opened glyphicon-close').removeClass('glyphicon-nav');
                }).on('close', function() {
                    $('.header').css({'position': '', 'top': ''});
                    $('.header__toggle-menu').removeClass('header__toggle-menu_opened glyphicon-close').addClass('glyphicon-nav');
                });

                $('.header__toggle-menu').on('click', function() {
                    slideout.toggle();
                });
            }
        }
        else if (Modernizr.mq('(min-width: ' + $screenMdMin + ')')) {
            $('.menu').appendTo('.header__inner-bottom>.container-fluid');
            $('.form-search').appendTo('.header__inner-bottom>.container-fluid');

            if ($asideSlideout.hasClass('slideout-init')) {
                slideout.destroy();
                $asideSlideout.removeClass('slideout-init');

                $('.header__toggle-menu').off('click');
            }
        }
    }).triggerHandler('resize.asideSlideout');
});


$(function () {
    $('body').on('click', '.form-search__btn', function () {
        $(this).toggleClass('glyphicon-search glyphicon-close');
        $('.menu').toggleClass('hidden-md hidden-lg');
        $('.form-search').toggleClass('form-search_opened');
        $('.form-search__field').focus();
    });
});

$(function () {
    $('body').on('click', '.menu__item_submenu>.menu__btn>.menu__icon', function (e) {
        e.preventDefault();
        $('.menu__submenu')
            .not($(this).parent().next('.menu__submenu').toggleClass('opened').toggle().parent().toggleClass('opened').end())
            .not($(this).parents('.menu__submenu'))
            .removeClass('opened').hide().parent().removeClass('opened');
    }).on('click', function (e) {
        if (!$(e.target).closest('.menu__item_submenu>.menu__btn>.menu__icon').length) {
            $('.menu__submenu').removeClass('opened').hide().parent().removeClass('opened');
        }
    }).on('click', '.menu__btn', function (e) {
        var hash = $(this).attr('href'),
        $elem = $('' + hash);
        if ($elem.length) {
            e.preventDefault();
            $('.header__toggle-menu').triggerHandler('click');

            $(this).parent().addClass('menu__item_current').siblings().removeClass('menu__item_current');

            var scrollTop = $elem.offset().top - (Modernizr.mq('(max-width: ' + $screenSmMax + ')') ? $('.header').outerHeight() : 0);
            Modernizr.mq('(max-width: ' + $screenSmMax + ')') ? $('.header').css({'top': scrollTop}) : null;

            $('html, body').animate({'scrollTop': scrollTop},
                Modernizr.mq('(max-width: ' + $screenSmMax + ')') ? 0 : 300, 'linear', function () {
                //$('.header').css({'top': ''});
                location.hash = hash;
            });
        }
    });
});

$(function () {

});

$(function () {
    $('.slider-main').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 300,
        fade: true,
        cssEase: 'linear',
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        autoplay: true,
        autoplaySpeed: 5000,
        zIndex: 1,
        lazyLoad: 'ondemand',
        responsive: [

        ]
    }).on('lazyLoaded', function (event, slick, image, imageSource) {
        $(image).closest('.slick-slide').removeClass('loading');
    });
});

function updateProgress(item, base) {
    var $bar = item.find('.countdown__bar');
    var r = $bar.attr('r');
    var l = Math.PI*(r*2);
    var pct = ((base-item.data('val'))/base)*l;
    $bar.css({strokeDasharray: l});
    $bar.css({strokeDashoffset: pct});
}

function updater(countdown, baseTime) {
    function update() {
        var cur = new Date();
        // сколько осталось миллисекунд
        var diff = new Date(baseTime) - cur; //console.log(diff);

        if (diff > 0) {
            // сколько миллисекунд до конца секунды
            var millis = diff % 1000;
            diff = Math.floor(diff/1000);
            // сколько секунд до конца минуты
            var sec = diff % 60;
            if(sec < 10) sec = "0"+sec;
            diff = Math.floor(diff/60);
            // сколько минут до конца часа
            var min = diff % 60;
            if(min < 10) min = "0"+min;
            diff = Math.floor(diff/60);
            // сколько часов до конца дня
            var hours = diff % 24;
            if(hours < 10) hours = "0"+hours;
            var days = Math.floor(diff / 24);

            var $d = $(countdown).find('.countdown__item_days');
            var $h = $(countdown).find('.countdown__item_hours');
            var $m = $(countdown).find('.countdown__item_minutes');
            var $s = $(countdown).find('.countdown__item_seconds');

            $d.data('val', days).find('.countdown__digit').text(days);
            updateProgress($d, 365);
            $h.data('val', hours).find('.countdown__digit').text(hours);
            updateProgress($h, 24);
            $m.data('val', min).find('.countdown__digit').text(min);
            updateProgress($m, 60);
            $s.data('val', sec).find('.countdown__digit').text(sec);
            updateProgress($s, 60);

            // следующий раз вызываем себя, когда закончится текущая секунда
            setTimeout(update, millis);
        }
    }
    setTimeout(update, 0);
}

$(function () {
    $('.countdown').each(function () {
        updater(this, $(this).data('time'));
    });
});

$(function () {
   $('.form-order').validate(
       {
           onkeyup: function(element) {
               this.element(element);
           },
           onfocusout: function(element) {
               this.element(element);
           },
           errorElement: 'div',
           errorPlacement: function(error, element) {
               error.addClass('form-msg form-msg_error').insertAfter(element.closest('.text-field, .checkbox, .radio'));
           }
       }
   );
});

function hasVal() {
    $('.text-field').on('blur', function () {
        if ($(this).val()) {
            $(this).addClass('text-field_has-val');
        }
        else {
            $(this).removeClass('text-field_has-val');
        }
    });
}
$(function () {
    hasVal();
});

$(function () {
    $('body').on('click', '.collapse-box__btn', function () {
        var $collapseBox = $(this).fadeToggle(500).closest('.collapse-box');
        $collapseBox.toggleClass('collapse-box_opened');
    });
});

$(function () {
    $('.reviews-list.slick-slider').slick({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        fade: false,
        cssEase: 'ease-out',
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        autoplay: false,
        autoplaySpeed: 5000,
        zIndex: 1,
        lazyLoad: 'ondemand',
        asNavFor: '',
        responsive: [
            {
                breakpoint: parseInt($screenSmMin)*$fontSizeRootComputed - 1,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: parseInt($screenMdMin)*$fontSizeRootComputed - 1,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    }).on('lazyLoaded', function (event, slick, image, imageSource) {
        $(image).closest('.slick-slide').removeClass('loading');
    });
});

$(function () {
    $('.tabs').each(function () {
        var $tabs = $(this), $tabsNavItem = $tabs.find('.tabs__nav-item'), $tabsContentItem = $tabs.find('.tabs__content-item');
        $tabsNavItem.eq(0).addClass('tabs__nav-item_opened');
        $tabsContentItem.hide().eq(0).addClass('tabs__content-item_opened').show();

        $tabsNavItem.on('click', function () {
            $tabsNavItem.not($(this).addClass('tabs__nav-item_opened')).removeClass('tabs__nav-item_opened');
            var $currentTab = $('[data-id="' + $(this).attr('href').split('#')[1] + '"]');
            $tabsContentItem.not($currentTab.addClass('tabs__content-item_opened').fadeIn(200)).removeClass('tabs__content-item_opened').fadeOut(200);
        });
    });
});

$(function () {
    $("[data-fancybox--single]").fancybox({
        smallBtn : false,
        autoFocus : false,
        btnTpl : {
            slideShow  : '<button data-fancybox-play class="fancybox-button fancybox-button--play hide" title="{{PLAY_START}}"></button>',
            fullScreen : '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen hide" title="{{FULL_SCREEN}}"></button>',
            thumbs     : '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs hide" title="{{THUMBS}}"></button>',
            close      : '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn   : '<button data-fancybox-close class="fancybox-close-small glyphicon glyphicon-close-2" title="{{CLOSE}}"></button>'
        },
        keyboard: false,
        arrows: false,
        touch: false,
        onInit: function () {

        },
        beforeClose: function () {

        }
    });

    $("[data-fancybox--group]").fancybox({
        smallBtn : false,
        autoFocus : false,
        btnTpl : {
            slideShow  : '<button data-fancybox-play class="fancybox-button fancybox-button--play hide" title="{{PLAY_START}}"></button>',
            fullScreen : '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen hide" title="{{FULL_SCREEN}}"></button>',
            thumbs     : '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs hide" title="{{THUMBS}}"></button>',
            close      : '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn   : '<button data-fancybox-close class="fancybox-close-small glyphicon glyphicon-close-2" title="{{CLOSE}}"></button>'
        },
        onInit: function () {

        },
        beforeClose: function () {

        }
    });

    $("[data-fancybox--gallery]").fancybox({
        smallBtn : false,
        autoFocus : false,
        btnTpl : {
            slideShow  : '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
            fullScreen : '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
            thumbs     : '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
            close      : '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn   : '<button data-fancybox-close class="fancybox-close-small glyphicon glyphicon-close-2" title="{{CLOSE}}"></button>'
        },
        onInit: function () {

        },
        beforeClose: function () {

        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiLCJhc2lkZS1zbGlkZW91dC5qcyIsImZvcm0tc2VhcmNoLmpzIiwibWVudS5qcyIsImhlYWRlci5qcyIsInNsaWRlci1tYWluLmpzIiwiY291bnRkb3duLmpzIiwiZm9ybS1vcmRlci5qcyIsInRleHQtZmllbGQuanMiLCJjb2xsYXBzZS1ib3guanMiLCJyZXZpZXdzLWxpc3QuanMiLCJ0YWJzLmpzIiwicG9wdXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYmxvY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyICRzY3JlZW5TbSA9IDc2OCwgJHNjcmVlbk1kID0gMTAyNCwgJHNjcmVlbkxnID0gMTI4MDtcblxudmFyICRmb250U2l6ZVJvb3QgPSAxNiwgJGZvbnRTaXplUm9vdENvbXB1dGVkID0gcGFyc2VJbnQoJCgnaHRtbCcpLmNzcygnZm9udFNpemUnKSk7XG5cbnZhciAkc2NyZWVuU21NaW4gPSAkc2NyZWVuU20vJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuU21NaW4gPSAnICsgJHNjcmVlblNtTWluICsgJyAoJyArICRzY3JlZW5TbSArICdweCknKTtcbnZhciAkc2NyZWVuTWRNaW4gPSAkc2NyZWVuTWQvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuTWRNaW4gPSAnICsgJHNjcmVlbk1kTWluICsgJyAoJyArICRzY3JlZW5NZCArICdweCknKTtcbnZhciAkc2NyZWVuTGdNaW4gPSAkc2NyZWVuTGcvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuTGdNaW4gPSAnICsgJHNjcmVlbkxnTWluICsgJyAoJyArICRzY3JlZW5MZyArICdweCknKTtcblxudmFyICRzY3JlZW5Yc01heCA9ICgkc2NyZWVuU20gLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5Yc01heCA9ICcgKyAkc2NyZWVuWHNNYXgpO1xudmFyICRzY3JlZW5TbU1heCA9ICgkc2NyZWVuTWQgLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5TbU1heCA9ICcgKyAkc2NyZWVuU21NYXgpO1xudmFyICRzY3JlZW5NZE1heCA9ICgkc2NyZWVuTGcgLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5NZE1heCA9ICcgKyAkc2NyZWVuTWRNYXgpO1xuXG5pZignV2Via2l0QXBwZWFyYW5jZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKSB7XG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCd3ZWJraXQnKTtcbn1cbiIsIiQoZnVuY3Rpb24gKCkge1xuICAgIHZhciAkYXNpZGVTbGlkZW91dD0kKCcuYXNpZGUtc2xpZGVvdXQnKSwgc2xpZGVvdXQ7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYXNpZGVTbGlkZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICRzY3JlZW5TbU1heCArICcpJykpIHtcbiAgICAgICAgICAgICQoJy5mb3JtLXNlYXJjaCcpLmFwcGVuZFRvKCRhc2lkZVNsaWRlb3V0KTtcbiAgICAgICAgICAgICQoJy5tZW51JykuYXBwZW5kVG8oJGFzaWRlU2xpZGVvdXQpO1xuXG4gICAgICAgICAgICBpZiAoISRhc2lkZVNsaWRlb3V0Lmhhc0NsYXNzKCdzbGlkZW91dC1pbml0JykpIHtcbiAgICAgICAgICAgICAgICBzbGlkZW91dCA9IG5ldyBTbGlkZW91dCh7XG4gICAgICAgICAgICAgICAgICAgICdwYW5lbCc6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJyksXG4gICAgICAgICAgICAgICAgICAgICdtZW51JzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFzaWRlLXNsaWRlb3V0JyksXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nJzogMjYwLFxuICAgICAgICAgICAgICAgICAgICAndG9sZXJhbmNlJzogNzBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkYXNpZGVTbGlkZW91dC5hZGRDbGFzcygnc2xpZGVvdXQtaW5pdCcpO1xuXG4gICAgICAgICAgICAgICAgc2xpZGVvdXQub24oJ2JlZm9yZW9wZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcicpLmNzcyh7J3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6ICQod2luZG93KS5zY3JvbGxUb3AoKX0pO1xuICAgICAgICAgICAgICAgIH0pLm9uKCd0cmFuc2xhdGUnLCBmdW5jdGlvbih0cmFuc2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXInKS5jc3Moeydwb3NpdGlvbic6ICdhYnNvbHV0ZScsICd0b3AnOiAkKHdpbmRvdykuc2Nyb2xsVG9wKCl9KTtcbiAgICAgICAgICAgICAgICB9KS5vbignb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLmFkZENsYXNzKCdoZWFkZXJfX3RvZ2dsZS1tZW51X29wZW5lZCBnbHlwaGljb24tY2xvc2UnKS5yZW1vdmVDbGFzcygnZ2x5cGhpY29uLW5hdicpO1xuICAgICAgICAgICAgICAgIH0pLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyJykuY3NzKHsncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51JykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fdG9nZ2xlLW1lbnVfb3BlbmVkIGdseXBoaWNvbi1jbG9zZScpLmFkZENsYXNzKCdnbHlwaGljb24tbmF2Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZW91dC50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyAkc2NyZWVuTWRNaW4gKyAnKScpKSB7XG4gICAgICAgICAgICAkKCcubWVudScpLmFwcGVuZFRvKCcuaGVhZGVyX19pbm5lci1ib3R0b20+LmNvbnRhaW5lci1mbHVpZCcpO1xuICAgICAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykuYXBwZW5kVG8oJy5oZWFkZXJfX2lubmVyLWJvdHRvbT4uY29udGFpbmVyLWZsdWlkJyk7XG5cbiAgICAgICAgICAgIGlmICgkYXNpZGVTbGlkZW91dC5oYXNDbGFzcygnc2xpZGVvdXQtaW5pdCcpKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVvdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRhc2lkZVNsaWRlb3V0LnJlbW92ZUNsYXNzKCdzbGlkZW91dC1pbml0Jyk7XG5cbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLm9mZignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pLnRyaWdnZXJIYW5kbGVyKCdyZXNpemUuYXNpZGVTbGlkZW91dCcpO1xufSk7XG4iLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5mb3JtLXNlYXJjaF9fYnRuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdnbHlwaGljb24tc2VhcmNoIGdseXBoaWNvbi1jbG9zZScpO1xuICAgICAgICAkKCcubWVudScpLnRvZ2dsZUNsYXNzKCdoaWRkZW4tbWQgaGlkZGVuLWxnJyk7XG4gICAgICAgICQoJy5mb3JtLXNlYXJjaCcpLnRvZ2dsZUNsYXNzKCdmb3JtLXNlYXJjaF9vcGVuZWQnKTtcbiAgICAgICAgJCgnLmZvcm0tc2VhcmNoX19maWVsZCcpLmZvY3VzKCk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tZW51X19pdGVtX3N1Ym1lbnU+Lm1lbnVfX2J0bj4ubWVudV9faWNvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnLm1lbnVfX3N1Ym1lbnUnKVxuICAgICAgICAgICAgLm5vdCgkKHRoaXMpLnBhcmVudCgpLm5leHQoJy5tZW51X19zdWJtZW51JykudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpLnRvZ2dsZSgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdvcGVuZWQnKS5lbmQoKSlcbiAgICAgICAgICAgIC5ub3QoJCh0aGlzKS5wYXJlbnRzKCcubWVudV9fc3VibWVudScpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5oaWRlKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xuICAgIH0pLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghJChlLnRhcmdldCkuY2xvc2VzdCgnLm1lbnVfX2l0ZW1fc3VibWVudT4ubWVudV9fYnRuPi5tZW51X19pY29uJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkKCcubWVudV9fc3VibWVudScpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5oaWRlKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgfSkub24oJ2NsaWNrJywgJy5tZW51X19idG4nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaGFzaCA9ICQodGhpcykuYXR0cignaHJlZicpLFxuICAgICAgICAkZWxlbSA9ICQoJycgKyBoYXNoKTtcbiAgICAgICAgaWYgKCRlbGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCgnLmhlYWRlcl9fdG9nZ2xlLW1lbnUnKS50cmlnZ2VySGFuZGxlcignY2xpY2snKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkZWxlbS5vZmZzZXQoKS50b3AgLSAoTW9kZXJuaXpyLm1xKCcobWF4LXdpZHRoOiAnICsgJHNjcmVlblNtTWF4ICsgJyknKSA/ICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpIDogMCk7XG4gICAgICAgICAgICBNb2Rlcm5penIubXEoJyhtYXgtd2lkdGg6ICcgKyAkc2NyZWVuU21NYXggKyAnKScpID8gJCgnLmhlYWRlcicpLmNzcyh7J3RvcCc6IHNjcm9sbFRvcH0pIDogbnVsbDtcblxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeydzY3JvbGxUb3AnOiBzY3JvbGxUb3B9LFxuICAgICAgICAgICAgICAgIE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICRzY3JlZW5TbU1heCArICcpJykgPyAwIDogMzAwLCAnbGluZWFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vJCgnLmhlYWRlcicpLmNzcyh7J3RvcCc6ICcnfSk7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IGhhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG5cbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5zbGlkZXItbWFpbicpLnNsaWNrKHtcbiAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICBzcGVlZDogMzAwLFxuICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICBjc3NFYXNlOiAnbGluZWFyJyxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjwvYnV0dG9uPicsXG4gICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjwvYnV0dG9uPicsXG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICByZXNwb25zaXZlOiBbXG5cbiAgICAgICAgXVxuICAgIH0pLm9uKCdsYXp5TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgaW1hZ2UsIGltYWdlU291cmNlKSB7XG4gICAgICAgICQoaW1hZ2UpLmNsb3Nlc3QoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgfSk7XG59KTsiLCJmdW5jdGlvbiB1cGRhdGVQcm9ncmVzcyhpdGVtLCBiYXNlKSB7XG4gICAgdmFyICRiYXIgPSBpdGVtLmZpbmQoJy5jb3VudGRvd25fX2JhcicpO1xuICAgIHZhciByID0gJGJhci5hdHRyKCdyJyk7XG4gICAgdmFyIGwgPSBNYXRoLlBJKihyKjIpO1xuICAgIHZhciBwY3QgPSAoKGJhc2UtaXRlbS5kYXRhKCd2YWwnKSkvYmFzZSkqbDtcbiAgICAkYmFyLmNzcyh7c3Ryb2tlRGFzaGFycmF5OiBsfSk7XG4gICAgJGJhci5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVyKGNvdW50ZG93biwgYmFzZVRpbWUpIHtcbiAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIHZhciBjdXIgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvtGB0YLQsNC70L7RgdGMINC80LjQu9C70LjRgdC10LrRg9C90LRcbiAgICAgICAgdmFyIGRpZmYgPSBuZXcgRGF0ZShiYXNlVGltZSkgLSBjdXI7IC8vY29uc29sZS5sb2coZGlmZik7XG5cbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvNC40LvQu9C40YHQtdC60YPQvdC0INC00L4g0LrQvtC90YbQsCDRgdC10LrRg9C90LTRi1xuICAgICAgICAgICAgdmFyIG1pbGxpcyA9IGRpZmYgJSAxMDAwO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi8xMDAwKTtcbiAgICAgICAgICAgIC8vINGB0LrQvtC70YzQutC+INGB0LXQutGD0L3QtCDQtNC+INC60L7QvdGG0LAg0LzQuNC90YPRgtGLXG4gICAgICAgICAgICB2YXIgc2VjID0gZGlmZiAlIDYwO1xuICAgICAgICAgICAgaWYoc2VjIDwgMTApIHNlYyA9IFwiMFwiK3NlYztcbiAgICAgICAgICAgIGRpZmYgPSBNYXRoLmZsb29yKGRpZmYvNjApO1xuICAgICAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0LzQuNC90YPRgiDQtNC+INC60L7QvdGG0LAg0YfQsNGB0LBcbiAgICAgICAgICAgIHZhciBtaW4gPSBkaWZmICUgNjA7XG4gICAgICAgICAgICBpZihtaW4gPCAxMCkgbWluID0gXCIwXCIrbWluO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi82MCk7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDRh9Cw0YHQvtCyINC00L4g0LrQvtC90YbQsCDQtNC90Y9cbiAgICAgICAgICAgIHZhciBob3VycyA9IGRpZmYgJSAyNDtcbiAgICAgICAgICAgIGlmKGhvdXJzIDwgMTApIGhvdXJzID0gXCIwXCIraG91cnM7XG4gICAgICAgICAgICB2YXIgZGF5cyA9IE1hdGguZmxvb3IoZGlmZiAvIDI0KTtcblxuICAgICAgICAgICAgdmFyICRkID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1fZGF5cycpO1xuICAgICAgICAgICAgdmFyICRoID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1faG91cnMnKTtcbiAgICAgICAgICAgIHZhciAkbSA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX21pbnV0ZXMnKTtcbiAgICAgICAgICAgIHZhciAkcyA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX3NlY29uZHMnKTtcblxuICAgICAgICAgICAgJGQuZGF0YSgndmFsJywgZGF5cykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGRheXMpO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJGQsIDM2NSk7XG4gICAgICAgICAgICAkaC5kYXRhKCd2YWwnLCBob3VycykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGhvdXJzKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCRoLCAyNCk7XG4gICAgICAgICAgICAkbS5kYXRhKCd2YWwnLCBtaW4pLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChtaW4pO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJG0sIDYwKTtcbiAgICAgICAgICAgICRzLmRhdGEoJ3ZhbCcsIHNlYykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KHNlYyk7XG4gICAgICAgICAgICB1cGRhdGVQcm9ncmVzcygkcywgNjApO1xuXG4gICAgICAgICAgICAvLyDRgdC70LXQtNGD0Y7RidC40Lkg0YDQsNC3INCy0YvQt9GL0LLQsNC10Lwg0YHQtdCx0Y8sINC60L7Qs9C00LAg0LfQsNC60L7QvdGH0LjRgtGB0Y8g0YLQtdC60YPRidCw0Y8g0YHQtdC60YPQvdC00LBcbiAgICAgICAgICAgIHNldFRpbWVvdXQodXBkYXRlLCBtaWxsaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQodXBkYXRlLCAwKTtcbn1cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmNvdW50ZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVyKHRoaXMsICQodGhpcykuZGF0YSgndGltZScpKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgJCgnLmZvcm0tb3JkZXInKS52YWxpZGF0ZShcbiAgICAgICB7XG4gICAgICAgICAgIG9ua2V5dXA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgb25mb2N1c291dDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICB9LFxuICAgICAgICAgICBlcnJvckVsZW1lbnQ6ICdkaXYnLFxuICAgICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIGVycm9yLmFkZENsYXNzKCdmb3JtLW1zZyBmb3JtLW1zZ19lcnJvcicpLmluc2VydEFmdGVyKGVsZW1lbnQuY2xvc2VzdCgnLnRleHQtZmllbGQsIC5jaGVja2JveCwgLnJhZGlvJykpO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgKTtcbn0pOyIsImZ1bmN0aW9uIGhhc1ZhbCgpIHtcbiAgICAkKCcudGV4dC1maWVsZCcpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygndGV4dC1maWVsZF9oYXMtdmFsJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd0ZXh0LWZpZWxkX2hhcy12YWwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuJChmdW5jdGlvbiAoKSB7XG4gICAgaGFzVmFsKCk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5jb2xsYXBzZS1ib3hfX2J0bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRjb2xsYXBzZUJveCA9ICQodGhpcykuZmFkZVRvZ2dsZSg1MDApLmNsb3Nlc3QoJy5jb2xsYXBzZS1ib3gnKTtcbiAgICAgICAgJGNvbGxhcHNlQm94LnRvZ2dsZUNsYXNzKCdjb2xsYXBzZS1ib3hfb3BlbmVkJyk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcucmV2aWV3cy1saXN0LnNsaWNrLXNsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgIHNwZWVkOiAzMDAsXG4gICAgICAgIGZhZGU6IGZhbHNlLFxuICAgICAgICBjc3NFYXNlOiAnZWFzZS1vdXQnLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PC9idXR0b24+JyxcbiAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PC9idXR0b24+JyxcbiAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICBhc05hdkZvcjogJycsXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBwYXJzZUludCgkc2NyZWVuU21NaW4pKiRmb250U2l6ZVJvb3RDb21wdXRlZCAtIDEsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogcGFyc2VJbnQoJHNjcmVlbk1kTWluKSokZm9udFNpemVSb290Q29tcHV0ZWQgLSAxLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KS5vbignbGF6eUxvYWRlZCcsIGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGltYWdlLCBpbWFnZVNvdXJjZSkge1xuICAgICAgICAkKGltYWdlKS5jbG9zZXN0KCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnRhYnMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICR0YWJzID0gJCh0aGlzKSwgJHRhYnNOYXZJdGVtID0gJHRhYnMuZmluZCgnLnRhYnNfX25hdi1pdGVtJyksICR0YWJzQ29udGVudEl0ZW0gPSAkdGFicy5maW5kKCcudGFic19fY29udGVudC1pdGVtJyk7XG4gICAgICAgICR0YWJzTmF2SXRlbS5lcSgwKS5hZGRDbGFzcygndGFic19fbmF2LWl0ZW1fb3BlbmVkJyk7XG4gICAgICAgICR0YWJzQ29udGVudEl0ZW0uaGlkZSgpLmVxKDApLmFkZENsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuc2hvdygpO1xuXG4gICAgICAgICR0YWJzTmF2SXRlbS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdGFic05hdkl0ZW0ubm90KCQodGhpcykuYWRkQ2xhc3MoJ3RhYnNfX25hdi1pdGVtX29wZW5lZCcpKS5yZW1vdmVDbGFzcygndGFic19fbmF2LWl0ZW1fb3BlbmVkJyk7XG4gICAgICAgICAgICB2YXIgJGN1cnJlbnRUYWIgPSAkKCdbZGF0YS1pZD1cIicgKyAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zcGxpdCgnIycpWzFdICsgJ1wiXScpO1xuICAgICAgICAgICAgJHRhYnNDb250ZW50SXRlbS5ub3QoJGN1cnJlbnRUYWIuYWRkQ2xhc3MoJ3RhYnNfX2NvbnRlbnQtaXRlbV9vcGVuZWQnKS5mYWRlSW4oMjAwKSkucmVtb3ZlQ2xhc3MoJ3RhYnNfX2NvbnRlbnQtaXRlbV9vcGVuZWQnKS5mYWRlT3V0KDIwMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWZhbmN5Ym94LS1zaW5nbGVdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIGtleWJvYXJkOiBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgdG91Y2g6IGZhbHNlLFxuICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1mYW5jeWJveC0tZ3JvdXBdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIltkYXRhLWZhbmN5Ym94LS1nYWxsZXJ5XVwiKS5mYW5jeWJveCh7XG4gICAgICAgIHNtYWxsQnRuIDogZmFsc2UsXG4gICAgICAgIGF1dG9Gb2N1cyA6IGZhbHNlLFxuICAgICAgICBidG5UcGwgOiB7XG4gICAgICAgICAgICBzbGlkZVNob3cgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1wbGF5IGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tcGxheVwiIHRpdGxlPVwie3tQTEFZX1NUQVJUfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZnVsbFNjcmVlbiA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtZnVsbHNjcmVlbiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWZ1bGxzY3JlZW5cIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnNcIiB0aXRsZT1cInt7VEhVTUJTfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgY2xvc2UgICAgICA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtY2xvc2UgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1jbG9zZVwiIHRpdGxlPVwie3tDTE9TRX19XCI+PC9idXR0b24+JyxcblxuICAgICAgICAgICAgLy8gVGhpcyBzbWFsbCBjbG9zZSBidXR0b24gd2lsbCBiZSBhcHBlbmRlZCB0byB5b3VyIGh0bWwvaW5saW5lL2FqYXggY29udGVudCBieSBkZWZhdWx0LFxuICAgICAgICAgICAgLy8gaWYgXCJzbWFsbEJ0blwiIG9wdGlvbiBpcyBub3Qgc2V0IHRvIGZhbHNlXG4gICAgICAgICAgICBzbWFsbEJ0biAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWNsb3NlLXNtYWxsIGdseXBoaWNvbiBnbHlwaGljb24tY2xvc2UtMlwiIHRpdGxlPVwie3tDTE9TRX19XCI+PC9idXR0b24+J1xuICAgICAgICB9LFxuICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyJdfQ==
