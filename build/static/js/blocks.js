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

    $(window).on('scroll.Menu', function () {
        var $curr = $('.menu__btn_lvl_1:first');
        var pos = $(this).scrollTop() + $('.header').outerHeight();
        $('.section[id]').each(function () {
            if (pos >= $(this).offset().top) {
                $curr = $('[href$="#' + $(this).attr('id') + '"]');
            }
        });
        if ($curr.length) {
            $curr.parent().addClass('menu__item_current').siblings().removeClass('menu__item_current');
            //location.hash = $curr.attr('href');
        }
        //console.log($curr.attr('href'));
    }).triggerHandler('scroll.Menu');
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

$(document).ajaxComplete(function() {
    hasVal();
    $('[data-mask]').each(function () {
        $(this).mask($(this).data('mask'));
    });
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
        $tabs.addClass('tabs_init');

        $tabsNavItem.on('click', function () {
            $tabsNavItem.not($(this).addClass('tabs__nav-item_opened')).removeClass('tabs__nav-item_opened');
            var $currentTab = $('[data-id="' + $(this).attr('href').split('#')[1] + '"]');
            $tabsContentItem.not($currentTab.addClass('tabs__content-item_opened').fadeIn(200)).removeClass('tabs__content-item_opened').fadeOut(200);
        });
    });
});

$(function () {
    $('.form-feedback').validate(
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiLCJhc2lkZS1zbGlkZW91dC5qcyIsImZvcm0tc2VhcmNoLmpzIiwibWVudS5qcyIsImhlYWRlci5qcyIsInNsaWRlci1tYWluLmpzIiwiY291bnRkb3duLmpzIiwiZm9ybS1vcmRlci5qcyIsInRleHQtZmllbGQuanMiLCJjb2xsYXBzZS1ib3guanMiLCJyZXZpZXdzLWxpc3QuanMiLCJ0YWJzLmpzIiwiZm9ybS1mZWVkYmFjay5qcyIsInBvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJibG9ja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgJHNjcmVlblNtID0gNzY4LCAkc2NyZWVuTWQgPSAxMDI0LCAkc2NyZWVuTGcgPSAxMjgwO1xuXG52YXIgJGZvbnRTaXplUm9vdCA9IDE2LCAkZm9udFNpemVSb290Q29tcHV0ZWQgPSBwYXJzZUludCgkKCdodG1sJykuY3NzKCdmb250U2l6ZScpKTtcblxudmFyICRzY3JlZW5TbU1pbiA9ICRzY3JlZW5TbS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5TbU1pbiA9ICcgKyAkc2NyZWVuU21NaW4gKyAnICgnICsgJHNjcmVlblNtICsgJ3B4KScpO1xudmFyICRzY3JlZW5NZE1pbiA9ICRzY3JlZW5NZC8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5NZE1pbiA9ICcgKyAkc2NyZWVuTWRNaW4gKyAnICgnICsgJHNjcmVlbk1kICsgJ3B4KScpO1xudmFyICRzY3JlZW5MZ01pbiA9ICRzY3JlZW5MZy8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5MZ01pbiA9ICcgKyAkc2NyZWVuTGdNaW4gKyAnICgnICsgJHNjcmVlbkxnICsgJ3B4KScpO1xuXG52YXIgJHNjcmVlblhzTWF4ID0gKCRzY3JlZW5TbSAtIDEpLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlblhzTWF4ID0gJyArICRzY3JlZW5Yc01heCk7XG52YXIgJHNjcmVlblNtTWF4ID0gKCRzY3JlZW5NZCAtIDEpLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlblNtTWF4ID0gJyArICRzY3JlZW5TbU1heCk7XG52YXIgJHNjcmVlbk1kTWF4ID0gKCRzY3JlZW5MZyAtIDEpLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlbk1kTWF4ID0gJyArICRzY3JlZW5NZE1heCk7XG5cbmlmKCdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUpIHtcbiAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ3dlYmtpdCcpO1xufVxuIiwiJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRhc2lkZVNsaWRlb3V0PSQoJy5hc2lkZS1zbGlkZW91dCcpLCBzbGlkZW91dDtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5hc2lkZVNsaWRlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoTW9kZXJuaXpyLm1xKCcobWF4LXdpZHRoOiAnICsgJHNjcmVlblNtTWF4ICsgJyknKSkge1xuICAgICAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykuYXBwZW5kVG8oJGFzaWRlU2xpZGVvdXQpO1xuICAgICAgICAgICAgJCgnLm1lbnUnKS5hcHBlbmRUbygkYXNpZGVTbGlkZW91dCk7XG5cbiAgICAgICAgICAgIGlmICghJGFzaWRlU2xpZGVvdXQuaGFzQ2xhc3MoJ3NsaWRlb3V0LWluaXQnKSkge1xuICAgICAgICAgICAgICAgIHNsaWRlb3V0ID0gbmV3IFNsaWRlb3V0KHtcbiAgICAgICAgICAgICAgICAgICAgJ3BhbmVsJzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndyYXBwZXInKSxcbiAgICAgICAgICAgICAgICAgICAgJ21lbnUnOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXNpZGUtc2xpZGVvdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmcnOiAyNjAsXG4gICAgICAgICAgICAgICAgICAgICd0b2xlcmFuY2UnOiA3MFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRhc2lkZVNsaWRlb3V0LmFkZENsYXNzKCdzbGlkZW91dC1pbml0Jyk7XG5cbiAgICAgICAgICAgICAgICBzbGlkZW91dC5vbignYmVmb3Jlb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyJykuY3NzKHsncG9zaXRpb24nOiAnYWJzb2x1dGUnLCAndG9wJzogJCh3aW5kb3cpLnNjcm9sbFRvcCgpfSk7XG4gICAgICAgICAgICAgICAgfSkub24oJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uKHRyYW5zbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcicpLmNzcyh7J3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6ICQod2luZG93KS5zY3JvbGxUb3AoKX0pO1xuICAgICAgICAgICAgICAgIH0pLm9uKCdvcGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51JykuYWRkQ2xhc3MoJ2hlYWRlcl9fdG9nZ2xlLW1lbnVfb3BlbmVkIGdseXBoaWNvbi1jbG9zZScpLnJlbW92ZUNsYXNzKCdnbHlwaGljb24tbmF2Jyk7XG4gICAgICAgICAgICAgICAgfSkub24oJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXInKS5jc3Moeydwb3NpdGlvbic6ICcnLCAndG9wJzogJyd9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fdG9nZ2xlLW1lbnUnKS5yZW1vdmVDbGFzcygnaGVhZGVyX190b2dnbGUtbWVudV9vcGVuZWQgZ2x5cGhpY29uLWNsb3NlJykuYWRkQ2xhc3MoJ2dseXBoaWNvbi1uYXYnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlb3V0LnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArICRzY3JlZW5NZE1pbiArICcpJykpIHtcbiAgICAgICAgICAgICQoJy5tZW51JykuYXBwZW5kVG8oJy5oZWFkZXJfX2lubmVyLWJvdHRvbT4uY29udGFpbmVyLWZsdWlkJyk7XG4gICAgICAgICAgICAkKCcuZm9ybS1zZWFyY2gnKS5hcHBlbmRUbygnLmhlYWRlcl9faW5uZXItYm90dG9tPi5jb250YWluZXItZmx1aWQnKTtcblxuICAgICAgICAgICAgaWYgKCRhc2lkZVNsaWRlb3V0Lmhhc0NsYXNzKCdzbGlkZW91dC1pbml0JykpIHtcbiAgICAgICAgICAgICAgICBzbGlkZW91dC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJGFzaWRlU2xpZGVvdXQucmVtb3ZlQ2xhc3MoJ3NsaWRlb3V0LWluaXQnKTtcblxuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51Jykub2ZmKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkudHJpZ2dlckhhbmRsZXIoJ3Jlc2l6ZS5hc2lkZVNsaWRlb3V0Jyk7XG59KTtcbiIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmZvcm0tc2VhcmNoX19idG4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2dseXBoaWNvbi1zZWFyY2ggZ2x5cGhpY29uLWNsb3NlJyk7XG4gICAgICAgICQoJy5tZW51JykudG9nZ2xlQ2xhc3MoJ2hpZGRlbi1tZCBoaWRkZW4tbGcnKTtcbiAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykudG9nZ2xlQ2xhc3MoJ2Zvcm0tc2VhcmNoX29wZW5lZCcpO1xuICAgICAgICAkKCcuZm9ybS1zZWFyY2hfX2ZpZWxkJykuZm9jdXMoKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnVfX2l0ZW1fc3VibWVudT4ubWVudV9fYnRuPi5tZW51X19pY29uJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCcubWVudV9fc3VibWVudScpXG4gICAgICAgICAgICAubm90KCQodGhpcykucGFyZW50KCkubmV4dCgnLm1lbnVfX3N1Ym1lbnUnKS50b2dnbGVDbGFzcygnb3BlbmVkJykudG9nZ2xlKCkucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpLmVuZCgpKVxuICAgICAgICAgICAgLm5vdCgkKHRoaXMpLnBhcmVudHMoJy5tZW51X19zdWJtZW51JykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpLmhpZGUoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XG4gICAgfSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCEkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWVudV9faXRlbV9zdWJtZW51Pi5tZW51X19idG4+Lm1lbnVfX2ljb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICQoJy5tZW51X19zdWJtZW51JykucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpLmhpZGUoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XG4gICAgICAgIH1cbiAgICB9KS5vbignY2xpY2snLCAnLm1lbnVfX2J0bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBoYXNoID0gJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICRlbGVtID0gJCgnJyArIGhhc2gpO1xuICAgICAgICBpZiAoJGVsZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLnRyaWdnZXJIYW5kbGVyKCdjbGljaycpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdtZW51X19pdGVtX2N1cnJlbnQnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdtZW51X19pdGVtX2N1cnJlbnQnKTtcblxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICRlbGVtLm9mZnNldCgpLnRvcCAtIChNb2Rlcm5penIubXEoJyhtYXgtd2lkdGg6ICcgKyAkc2NyZWVuU21NYXggKyAnKScpID8gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCkgOiAwKTtcbiAgICAgICAgICAgIE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICRzY3JlZW5TbU1heCArICcpJykgPyAkKCcuaGVhZGVyJykuY3NzKHsndG9wJzogc2Nyb2xsVG9wfSkgOiBudWxsO1xuXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7J3Njcm9sbFRvcCc6IHNjcm9sbFRvcH0sXG4gICAgICAgICAgICAgICAgTW9kZXJuaXpyLm1xKCcobWF4LXdpZHRoOiAnICsgJHNjcmVlblNtTWF4ICsgJyknKSA/IDAgOiAzMDAsICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8kKCcuaGVhZGVyJykuY3NzKHsndG9wJzogJyd9KTtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gaGFzaDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbC5NZW51JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGN1cnIgPSAkKCcubWVudV9fYnRuX2x2bF8xOmZpcnN0Jyk7XG4gICAgICAgIHZhciBwb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpICsgJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICQoJy5zZWN0aW9uW2lkXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHBvcyA+PSAkKHRoaXMpLm9mZnNldCgpLnRvcCkge1xuICAgICAgICAgICAgICAgICRjdXJyID0gJCgnW2hyZWYkPVwiIycgKyAkKHRoaXMpLmF0dHIoJ2lkJykgKyAnXCJdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoJGN1cnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAkY3Vyci5wYXJlbnQoKS5hZGRDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jyk7XG4gICAgICAgICAgICAvL2xvY2F0aW9uLmhhc2ggPSAkY3Vyci5hdHRyKCdocmVmJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZygkY3Vyci5hdHRyKCdocmVmJykpO1xuICAgIH0pLnRyaWdnZXJIYW5kbGVyKCdzY3JvbGwuTWVudScpO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG5cbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5zbGlkZXItbWFpbicpLnNsaWNrKHtcbiAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICBzcGVlZDogMzAwLFxuICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICBjc3NFYXNlOiAnbGluZWFyJyxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjwvYnV0dG9uPicsXG4gICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjwvYnV0dG9uPicsXG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICByZXNwb25zaXZlOiBbXG5cbiAgICAgICAgXVxuICAgIH0pLm9uKCdsYXp5TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgaW1hZ2UsIGltYWdlU291cmNlKSB7XG4gICAgICAgICQoaW1hZ2UpLmNsb3Nlc3QoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgfSk7XG59KTsiLCJmdW5jdGlvbiB1cGRhdGVQcm9ncmVzcyhpdGVtLCBiYXNlKSB7XG4gICAgdmFyICRiYXIgPSBpdGVtLmZpbmQoJy5jb3VudGRvd25fX2JhcicpO1xuICAgIHZhciByID0gJGJhci5hdHRyKCdyJyk7XG4gICAgdmFyIGwgPSBNYXRoLlBJKihyKjIpO1xuICAgIHZhciBwY3QgPSAoKGJhc2UtaXRlbS5kYXRhKCd2YWwnKSkvYmFzZSkqbDtcbiAgICAkYmFyLmNzcyh7c3Ryb2tlRGFzaGFycmF5OiBsfSk7XG4gICAgJGJhci5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVyKGNvdW50ZG93biwgYmFzZVRpbWUpIHtcbiAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIHZhciBjdXIgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvtGB0YLQsNC70L7RgdGMINC80LjQu9C70LjRgdC10LrRg9C90LRcbiAgICAgICAgdmFyIGRpZmYgPSBuZXcgRGF0ZShiYXNlVGltZSkgLSBjdXI7IC8vY29uc29sZS5sb2coZGlmZik7XG5cbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvNC40LvQu9C40YHQtdC60YPQvdC0INC00L4g0LrQvtC90YbQsCDRgdC10LrRg9C90LTRi1xuICAgICAgICAgICAgdmFyIG1pbGxpcyA9IGRpZmYgJSAxMDAwO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi8xMDAwKTtcbiAgICAgICAgICAgIC8vINGB0LrQvtC70YzQutC+INGB0LXQutGD0L3QtCDQtNC+INC60L7QvdGG0LAg0LzQuNC90YPRgtGLXG4gICAgICAgICAgICB2YXIgc2VjID0gZGlmZiAlIDYwO1xuICAgICAgICAgICAgaWYoc2VjIDwgMTApIHNlYyA9IFwiMFwiK3NlYztcbiAgICAgICAgICAgIGRpZmYgPSBNYXRoLmZsb29yKGRpZmYvNjApO1xuICAgICAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0LzQuNC90YPRgiDQtNC+INC60L7QvdGG0LAg0YfQsNGB0LBcbiAgICAgICAgICAgIHZhciBtaW4gPSBkaWZmICUgNjA7XG4gICAgICAgICAgICBpZihtaW4gPCAxMCkgbWluID0gXCIwXCIrbWluO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi82MCk7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDRh9Cw0YHQvtCyINC00L4g0LrQvtC90YbQsCDQtNC90Y9cbiAgICAgICAgICAgIHZhciBob3VycyA9IGRpZmYgJSAyNDtcbiAgICAgICAgICAgIGlmKGhvdXJzIDwgMTApIGhvdXJzID0gXCIwXCIraG91cnM7XG4gICAgICAgICAgICB2YXIgZGF5cyA9IE1hdGguZmxvb3IoZGlmZiAvIDI0KTtcblxuICAgICAgICAgICAgdmFyICRkID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1fZGF5cycpO1xuICAgICAgICAgICAgdmFyICRoID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1faG91cnMnKTtcbiAgICAgICAgICAgIHZhciAkbSA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX21pbnV0ZXMnKTtcbiAgICAgICAgICAgIHZhciAkcyA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX3NlY29uZHMnKTtcblxuICAgICAgICAgICAgJGQuZGF0YSgndmFsJywgZGF5cykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGRheXMpO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJGQsIDM2NSk7XG4gICAgICAgICAgICAkaC5kYXRhKCd2YWwnLCBob3VycykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGhvdXJzKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCRoLCAyNCk7XG4gICAgICAgICAgICAkbS5kYXRhKCd2YWwnLCBtaW4pLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChtaW4pO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJG0sIDYwKTtcbiAgICAgICAgICAgICRzLmRhdGEoJ3ZhbCcsIHNlYykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KHNlYyk7XG4gICAgICAgICAgICB1cGRhdGVQcm9ncmVzcygkcywgNjApO1xuXG4gICAgICAgICAgICAvLyDRgdC70LXQtNGD0Y7RidC40Lkg0YDQsNC3INCy0YvQt9GL0LLQsNC10Lwg0YHQtdCx0Y8sINC60L7Qs9C00LAg0LfQsNC60L7QvdGH0LjRgtGB0Y8g0YLQtdC60YPRidCw0Y8g0YHQtdC60YPQvdC00LBcbiAgICAgICAgICAgIHNldFRpbWVvdXQodXBkYXRlLCBtaWxsaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQodXBkYXRlLCAwKTtcbn1cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmNvdW50ZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVyKHRoaXMsICQodGhpcykuZGF0YSgndGltZScpKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgJCgnLmZvcm0tb3JkZXInKS52YWxpZGF0ZShcbiAgICAgICB7XG4gICAgICAgICAgIG9ua2V5dXA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgb25mb2N1c291dDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICB9LFxuICAgICAgICAgICBlcnJvckVsZW1lbnQ6ICdkaXYnLFxuICAgICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIGVycm9yLmFkZENsYXNzKCdmb3JtLW1zZyBmb3JtLW1zZ19lcnJvcicpLmluc2VydEFmdGVyKGVsZW1lbnQuY2xvc2VzdCgnLnRleHQtZmllbGQsIC5jaGVja2JveCwgLnJhZGlvJykpO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgKTtcbn0pOyIsImZ1bmN0aW9uIGhhc1ZhbCgpIHtcbiAgICAkKCcudGV4dC1maWVsZCcpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygndGV4dC1maWVsZF9oYXMtdmFsJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd0ZXh0LWZpZWxkX2hhcy12YWwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBoYXNWYWwoKTtcbn0pO1xuXG4kKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24oKSB7XG4gICAgaGFzVmFsKCk7XG4gICAgJCgnW2RhdGEtbWFza10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5tYXNrKCQodGhpcykuZGF0YSgnbWFzaycpKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmNvbGxhcHNlLWJveF9fYnRuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGNvbGxhcHNlQm94ID0gJCh0aGlzKS5mYWRlVG9nZ2xlKDUwMCkuY2xvc2VzdCgnLmNvbGxhcHNlLWJveCcpO1xuICAgICAgICAkY29sbGFwc2VCb3gudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlLWJveF9vcGVuZWQnKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5yZXZpZXdzLWxpc3Quc2xpY2stc2xpZGVyJykuc2xpY2soe1xuICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDMwMCxcbiAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgIGNzc0Vhc2U6ICdlYXNlLW91dCcsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48L2J1dHRvbj4nLFxuICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48L2J1dHRvbj4nLFxuICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgIGF1dG9wbGF5U3BlZWQ6IDUwMDAsXG4gICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgbGF6eUxvYWQ6ICdvbmRlbWFuZCcsXG4gICAgICAgIGFzTmF2Rm9yOiAnJyxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IHBhcnNlSW50KCRzY3JlZW5TbU1pbikqJGZvbnRTaXplUm9vdENvbXB1dGVkIC0gMSxcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBwYXJzZUludCgkc2NyZWVuTWRNaW4pKiRmb250U2l6ZVJvb3RDb21wdXRlZCAtIDEsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pLm9uKCdsYXp5TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgaW1hZ2UsIGltYWdlU291cmNlKSB7XG4gICAgICAgICQoaW1hZ2UpLmNsb3Nlc3QoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcudGFicycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJHRhYnMgPSAkKHRoaXMpLCAkdGFic05hdkl0ZW0gPSAkdGFicy5maW5kKCcudGFic19fbmF2LWl0ZW0nKSwgJHRhYnNDb250ZW50SXRlbSA9ICR0YWJzLmZpbmQoJy50YWJzX19jb250ZW50LWl0ZW0nKTtcbiAgICAgICAgJHRhYnNOYXZJdGVtLmVxKDApLmFkZENsYXNzKCd0YWJzX19uYXYtaXRlbV9vcGVuZWQnKTtcbiAgICAgICAgJHRhYnNDb250ZW50SXRlbS5oaWRlKCkuZXEoMCkuYWRkQ2xhc3MoJ3RhYnNfX2NvbnRlbnQtaXRlbV9vcGVuZWQnKS5zaG93KCk7XG4gICAgICAgICR0YWJzLmFkZENsYXNzKCd0YWJzX2luaXQnKTtcblxuICAgICAgICAkdGFic05hdkl0ZW0ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHRhYnNOYXZJdGVtLm5vdCgkKHRoaXMpLmFkZENsYXNzKCd0YWJzX19uYXYtaXRlbV9vcGVuZWQnKSkucmVtb3ZlQ2xhc3MoJ3RhYnNfX25hdi1pdGVtX29wZW5lZCcpO1xuICAgICAgICAgICAgdmFyICRjdXJyZW50VGFiID0gJCgnW2RhdGEtaWQ9XCInICsgJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVsxXSArICdcIl0nKTtcbiAgICAgICAgICAgICR0YWJzQ29udGVudEl0ZW0ubm90KCRjdXJyZW50VGFiLmFkZENsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuZmFkZUluKDIwMCkpLnJlbW92ZUNsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuZmFkZU91dCgyMDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5mb3JtLWZlZWRiYWNrJykudmFsaWRhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ua2V5dXA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25mb2N1c291dDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckVsZW1lbnQ6ICdkaXYnLFxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuYWRkQ2xhc3MoJ2Zvcm0tbXNnIGZvcm0tbXNnX2Vycm9yJykuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5jbG9zZXN0KCcudGV4dC1maWVsZCwgLmNoZWNrYm94LCAucmFkaW8nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWZhbmN5Ym94LS1zaW5nbGVdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIGtleWJvYXJkOiBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgdG91Y2g6IGZhbHNlLFxuICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1mYW5jeWJveC0tZ3JvdXBdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIltkYXRhLWZhbmN5Ym94LS1nYWxsZXJ5XVwiKS5mYW5jeWJveCh7XG4gICAgICAgIHNtYWxsQnRuIDogZmFsc2UsXG4gICAgICAgIGF1dG9Gb2N1cyA6IGZhbHNlLFxuICAgICAgICBidG5UcGwgOiB7XG4gICAgICAgICAgICBzbGlkZVNob3cgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1wbGF5IGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tcGxheVwiIHRpdGxlPVwie3tQTEFZX1NUQVJUfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZnVsbFNjcmVlbiA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtZnVsbHNjcmVlbiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWZ1bGxzY3JlZW5cIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnNcIiB0aXRsZT1cInt7VEhVTUJTfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgY2xvc2UgICAgICA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtY2xvc2UgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1jbG9zZVwiIHRpdGxlPVwie3tDTE9TRX19XCI+PC9idXR0b24+JyxcblxuICAgICAgICAgICAgLy8gVGhpcyBzbWFsbCBjbG9zZSBidXR0b24gd2lsbCBiZSBhcHBlbmRlZCB0byB5b3VyIGh0bWwvaW5saW5lL2FqYXggY29udGVudCBieSBkZWZhdWx0LFxuICAgICAgICAgICAgLy8gaWYgXCJzbWFsbEJ0blwiIG9wdGlvbiBpcyBub3Qgc2V0IHRvIGZhbHNlXG4gICAgICAgICAgICBzbWFsbEJ0biAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWNsb3NlLXNtYWxsIGdseXBoaWNvbiBnbHlwaGljb24tY2xvc2UtMlwiIHRpdGxlPVwie3tDTE9TRX19XCI+PC9idXR0b24+J1xuICAgICAgICB9LFxuICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyJdfQ==
