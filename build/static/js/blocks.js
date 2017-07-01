var $screenSm = 768, $screenMd = 1024, $screenLg = 1280;

var $fontSizeRoot = 16, $fontSizeRootComputed = parseInt($('html').css('fontSize'));

var $screenSmMin = $screenSm/$fontSizeRoot + 'em'; console.log('$screenSmMin = ' + $screenSmMin + ' (' + $screenSm + 'px)');
var $screenMdMin = $screenMd/$fontSizeRoot + 'em'; console.log('$screenMdMin = ' + $screenMdMin + ' (' + $screenMd + 'px)');
var $screenLgMin = $screenLg/$fontSizeRoot + 'em'; console.log('$screenLgMin = ' + $screenLgMin + ' (' + $screenLg + 'px)');

var $screenXsMax = ($screenSm - 1)/$fontSizeRoot + 'em'; console.log('$screenXsMax = ' + $screenXsMax);
var $screenSmMax = ($screenMd - 1)/$fontSizeRoot + 'em'; console.log('$screenSmMax = ' + $screenSmMax);
var $screenMdMax = ($screenLg - 1)/$fontSizeRoot + 'em'; console.log('$screenMdMax = ' + $screenMdMax);


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
        var $collapseBox = $(this).fadeOut(500).closest('.collapse-box');
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

        $tabsNavItem.on('click', function (e) {
            e.preventDefault();
            $tabsNavItem.not($(this).addClass('tabs__nav-item_opened')).removeClass('tabs__nav-item_opened');
            var $currentTab = $('[data-id="' + $(this).attr('href').split('#')[1] + '"]');
            $tabsContentItem.not($currentTab.addClass('tabs__content-item_opened').fadeIn(200)).removeClass('tabs__content-item_opened').hide();
        });

        $tabs.addClass('tabs_init');
    });
});

var map, mapEl = document.getElementById('map');
function initMap() {
    var myLatLng = {lat: 55.752565, lng: 37.614624};

    var map = new google.maps.Map(mapEl, {
        zoom: 15,
        center: myLatLng,
        scrollwheel: false
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: ''
    });
}
mapEl ? initMap() : null;

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
        touch: false,
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

$(function () {
    $('body').on('click', '.share-box__item_share-btn', function () {
        $(this).closest('.share-box').toggleClass('share-box_visible_all');
    });
});

$(function () {
    $('body').on('click', '[data-toggle=collapsible]', function () {
        $(this).closest('.collapsible').find('.collapsible__inner').slideToggle(200);
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiLCJhc2lkZS1zbGlkZW91dC5qcyIsImZvcm0tc2VhcmNoLmpzIiwibWVudS5qcyIsImhlYWRlci5qcyIsInNsaWRlci1tYWluLmpzIiwiY291bnRkb3duLmpzIiwiZm9ybS1vcmRlci5qcyIsInRleHQtZmllbGQuanMiLCJjb2xsYXBzZS1ib3guanMiLCJyZXZpZXdzLWxpc3QuanMiLCJ0YWJzLmpzIiwiY29udGFjdHMtbWFwLmpzIiwiZm9ybS1mZWVkYmFjay5qcyIsInBvcHVwLmpzIiwic2hhcmUtYm94LmpzIiwiY29sbGFwc2libGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkc2NyZWVuU20gPSA3NjgsICRzY3JlZW5NZCA9IDEwMjQsICRzY3JlZW5MZyA9IDEyODA7XG5cbnZhciAkZm9udFNpemVSb290ID0gMTYsICRmb250U2l6ZVJvb3RDb21wdXRlZCA9IHBhcnNlSW50KCQoJ2h0bWwnKS5jc3MoJ2ZvbnRTaXplJykpO1xuXG52YXIgJHNjcmVlblNtTWluID0gJHNjcmVlblNtLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlblNtTWluID0gJyArICRzY3JlZW5TbU1pbiArICcgKCcgKyAkc2NyZWVuU20gKyAncHgpJyk7XG52YXIgJHNjcmVlbk1kTWluID0gJHNjcmVlbk1kLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlbk1kTWluID0gJyArICRzY3JlZW5NZE1pbiArICcgKCcgKyAkc2NyZWVuTWQgKyAncHgpJyk7XG52YXIgJHNjcmVlbkxnTWluID0gJHNjcmVlbkxnLyRmb250U2l6ZVJvb3QgKyAnZW0nOyBjb25zb2xlLmxvZygnJHNjcmVlbkxnTWluID0gJyArICRzY3JlZW5MZ01pbiArICcgKCcgKyAkc2NyZWVuTGcgKyAncHgpJyk7XG5cbnZhciAkc2NyZWVuWHNNYXggPSAoJHNjcmVlblNtIC0gMSkvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuWHNNYXggPSAnICsgJHNjcmVlblhzTWF4KTtcbnZhciAkc2NyZWVuU21NYXggPSAoJHNjcmVlbk1kIC0gMSkvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuU21NYXggPSAnICsgJHNjcmVlblNtTWF4KTtcbnZhciAkc2NyZWVuTWRNYXggPSAoJHNjcmVlbkxnIC0gMSkvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuTWRNYXggPSAnICsgJHNjcmVlbk1kTWF4KTtcbiIsIiQoZnVuY3Rpb24gKCkge1xuICAgIHZhciAkYXNpZGVTbGlkZW91dD0kKCcuYXNpZGUtc2xpZGVvdXQnKSwgc2xpZGVvdXQ7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYXNpZGVTbGlkZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICRzY3JlZW5TbU1heCArICcpJykpIHtcbiAgICAgICAgICAgICQoJy5mb3JtLXNlYXJjaCcpLmFwcGVuZFRvKCRhc2lkZVNsaWRlb3V0KTtcbiAgICAgICAgICAgICQoJy5tZW51JykuYXBwZW5kVG8oJGFzaWRlU2xpZGVvdXQpO1xuXG4gICAgICAgICAgICBpZiAoISRhc2lkZVNsaWRlb3V0Lmhhc0NsYXNzKCdzbGlkZW91dC1pbml0JykpIHtcbiAgICAgICAgICAgICAgICBzbGlkZW91dCA9IG5ldyBTbGlkZW91dCh7XG4gICAgICAgICAgICAgICAgICAgICdwYW5lbCc6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJyksXG4gICAgICAgICAgICAgICAgICAgICdtZW51JzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFzaWRlLXNsaWRlb3V0JyksXG4gICAgICAgICAgICAgICAgICAgICdwYWRkaW5nJzogMjYwLFxuICAgICAgICAgICAgICAgICAgICAndG9sZXJhbmNlJzogNzBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkYXNpZGVTbGlkZW91dC5hZGRDbGFzcygnc2xpZGVvdXQtaW5pdCcpO1xuXG4gICAgICAgICAgICAgICAgc2xpZGVvdXQub24oJ2JlZm9yZW9wZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcicpLmNzcyh7J3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6ICQod2luZG93KS5zY3JvbGxUb3AoKX0pO1xuICAgICAgICAgICAgICAgIH0pLm9uKCd0cmFuc2xhdGUnLCBmdW5jdGlvbih0cmFuc2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXInKS5jc3Moeydwb3NpdGlvbic6ICdhYnNvbHV0ZScsICd0b3AnOiAkKHdpbmRvdykuc2Nyb2xsVG9wKCl9KTtcbiAgICAgICAgICAgICAgICB9KS5vbignb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLmFkZENsYXNzKCdoZWFkZXJfX3RvZ2dsZS1tZW51X29wZW5lZCBnbHlwaGljb24tY2xvc2UnKS5yZW1vdmVDbGFzcygnZ2x5cGhpY29uLW5hdicpO1xuICAgICAgICAgICAgICAgIH0pLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyJykuY3NzKHsncG9zaXRpb24nOiAnJywgJ3RvcCc6ICcnfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51JykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fdG9nZ2xlLW1lbnVfb3BlbmVkIGdseXBoaWNvbi1jbG9zZScpLmFkZENsYXNzKCdnbHlwaGljb24tbmF2Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZW91dC50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyAkc2NyZWVuTWRNaW4gKyAnKScpKSB7XG4gICAgICAgICAgICAkKCcubWVudScpLmFwcGVuZFRvKCcuaGVhZGVyX19pbm5lci1ib3R0b20+LmNvbnRhaW5lci1mbHVpZCcpO1xuICAgICAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykuYXBwZW5kVG8oJy5oZWFkZXJfX2lubmVyLWJvdHRvbT4uY29udGFpbmVyLWZsdWlkJyk7XG5cbiAgICAgICAgICAgIGlmICgkYXNpZGVTbGlkZW91dC5oYXNDbGFzcygnc2xpZGVvdXQtaW5pdCcpKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVvdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRhc2lkZVNsaWRlb3V0LnJlbW92ZUNsYXNzKCdzbGlkZW91dC1pbml0Jyk7XG5cbiAgICAgICAgICAgICAgICAkKCcuaGVhZGVyX190b2dnbGUtbWVudScpLm9mZignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pLnRyaWdnZXJIYW5kbGVyKCdyZXNpemUuYXNpZGVTbGlkZW91dCcpO1xufSk7XG4iLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5mb3JtLXNlYXJjaF9fYnRuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdnbHlwaGljb24tc2VhcmNoIGdseXBoaWNvbi1jbG9zZScpO1xuICAgICAgICAkKCcubWVudScpLnRvZ2dsZUNsYXNzKCdoaWRkZW4tbWQgaGlkZGVuLWxnJyk7XG4gICAgICAgICQoJy5mb3JtLXNlYXJjaCcpLnRvZ2dsZUNsYXNzKCdmb3JtLXNlYXJjaF9vcGVuZWQnKTtcbiAgICAgICAgJCgnLmZvcm0tc2VhcmNoX19maWVsZCcpLmZvY3VzKCk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tZW51X19pdGVtX3N1Ym1lbnU+Lm1lbnVfX2J0bj4ubWVudV9faWNvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnLm1lbnVfX3N1Ym1lbnUnKVxuICAgICAgICAgICAgLm5vdCgkKHRoaXMpLnBhcmVudCgpLm5leHQoJy5tZW51X19zdWJtZW51JykudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpLnRvZ2dsZSgpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdvcGVuZWQnKS5lbmQoKSlcbiAgICAgICAgICAgIC5ub3QoJCh0aGlzKS5wYXJlbnRzKCcubWVudV9fc3VibWVudScpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5oaWRlKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xuICAgIH0pLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghJChlLnRhcmdldCkuY2xvc2VzdCgnLm1lbnVfX2l0ZW1fc3VibWVudT4ubWVudV9fYnRuPi5tZW51X19pY29uJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkKCcubWVudV9fc3VibWVudScpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5oaWRlKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgfSkub24oJ2NsaWNrJywgJy5tZW51X19idG4nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaGFzaCA9ICQodGhpcykuYXR0cignaHJlZicpLFxuICAgICAgICAkZWxlbSA9ICQoJycgKyBoYXNoKTtcbiAgICAgICAgaWYgKCRlbGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCgnLmhlYWRlcl9fdG9nZ2xlLW1lbnUnKS50cmlnZ2VySGFuZGxlcignY2xpY2snKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnbWVudV9faXRlbV9jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkZWxlbS5vZmZzZXQoKS50b3AgLSAoTW9kZXJuaXpyLm1xKCcobWF4LXdpZHRoOiAnICsgJHNjcmVlblNtTWF4ICsgJyknKSA/ICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpIDogMCk7XG4gICAgICAgICAgICBNb2Rlcm5penIubXEoJyhtYXgtd2lkdGg6ICcgKyAkc2NyZWVuU21NYXggKyAnKScpID8gJCgnLmhlYWRlcicpLmNzcyh7J3RvcCc6IHNjcm9sbFRvcH0pIDogbnVsbDtcblxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeydzY3JvbGxUb3AnOiBzY3JvbGxUb3B9LFxuICAgICAgICAgICAgICAgIE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICRzY3JlZW5TbU1heCArICcpJykgPyAwIDogMzAwLCAnbGluZWFyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vJCgnLmhlYWRlcicpLmNzcyh7J3RvcCc6ICcnfSk7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IGhhc2g7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwuTWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRjdXJyID0gJCgnLm1lbnVfX2J0bl9sdmxfMTpmaXJzdCcpO1xuICAgICAgICB2YXIgcG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKSArICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAkKCcuc2VjdGlvbltpZF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwb3MgPj0gJCh0aGlzKS5vZmZzZXQoKS50b3ApIHtcbiAgICAgICAgICAgICAgICAkY3VyciA9ICQoJ1tocmVmJD1cIiMnICsgJCh0aGlzKS5hdHRyKCdpZCcpICsgJ1wiXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCRjdXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgJGN1cnIucGFyZW50KCkuYWRkQ2xhc3MoJ21lbnVfX2l0ZW1fY3VycmVudCcpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ21lbnVfX2l0ZW1fY3VycmVudCcpO1xuICAgICAgICAgICAgLy9sb2NhdGlvbi5oYXNoID0gJGN1cnIuYXR0cignaHJlZicpO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coJGN1cnIuYXR0cignaHJlZicpKTtcbiAgICB9KS50cmlnZ2VySGFuZGxlcignc2Nyb2xsLk1lbnUnKTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuXG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuc2xpZGVyLW1haW4nKS5zbGljayh7XG4gICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDMwMCxcbiAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgY3NzRWFzZTogJ2xpbmVhcicsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48L2J1dHRvbj4nLFxuICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48L2J1dHRvbj4nLFxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgYXV0b3BsYXlTcGVlZDogNTAwMCxcbiAgICAgICAgekluZGV4OiAxLFxuICAgICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuXG4gICAgICAgIF1cbiAgICB9KS5vbignbGF6eUxvYWRlZCcsIGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGltYWdlLCBpbWFnZVNvdXJjZSkge1xuICAgICAgICAkKGltYWdlKS5jbG9zZXN0KCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgIH0pO1xufSk7IiwiZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MoaXRlbSwgYmFzZSkge1xuICAgIHZhciAkYmFyID0gaXRlbS5maW5kKCcuY291bnRkb3duX19iYXInKTtcbiAgICB2YXIgciA9ICRiYXIuYXR0cigncicpO1xuICAgIHZhciBsID0gTWF0aC5QSSoocioyKTtcbiAgICB2YXIgcGN0ID0gKChiYXNlLWl0ZW0uZGF0YSgndmFsJykpL2Jhc2UpKmw7XG4gICAgJGJhci5jc3Moe3N0cm9rZURhc2hhcnJheTogbH0pO1xuICAgICRiYXIuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3R9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlcihjb3VudGRvd24sIGJhc2VUaW1lKSB7XG4gICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICB2YXIgY3VyID0gbmV3IERhdGUoKTtcbiAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0L7RgdGC0LDQu9C+0YHRjCDQvNC40LvQu9C40YHQtdC60YPQvdC0XG4gICAgICAgIHZhciBkaWZmID0gbmV3IERhdGUoYmFzZVRpbWUpIC0gY3VyOyAvL2NvbnNvbGUubG9nKGRpZmYpO1xuXG4gICAgICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0LzQuNC70LvQuNGB0LXQutGD0L3QtCDQtNC+INC60L7QvdGG0LAg0YHQtdC60YPQvdC00YtcbiAgICAgICAgICAgIHZhciBtaWxsaXMgPSBkaWZmICUgMTAwMDtcbiAgICAgICAgICAgIGRpZmYgPSBNYXRoLmZsb29yKGRpZmYvMTAwMCk7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDRgdC10LrRg9C90LQg0LTQviDQutC+0L3RhtCwINC80LjQvdGD0YLRi1xuICAgICAgICAgICAgdmFyIHNlYyA9IGRpZmYgJSA2MDtcbiAgICAgICAgICAgIGlmKHNlYyA8IDEwKSBzZWMgPSBcIjBcIitzZWM7XG4gICAgICAgICAgICBkaWZmID0gTWF0aC5mbG9vcihkaWZmLzYwKTtcbiAgICAgICAgICAgIC8vINGB0LrQvtC70YzQutC+INC80LjQvdGD0YIg0LTQviDQutC+0L3RhtCwINGH0LDRgdCwXG4gICAgICAgICAgICB2YXIgbWluID0gZGlmZiAlIDYwO1xuICAgICAgICAgICAgaWYobWluIDwgMTApIG1pbiA9IFwiMFwiK21pbjtcbiAgICAgICAgICAgIGRpZmYgPSBNYXRoLmZsb29yKGRpZmYvNjApO1xuICAgICAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0YfQsNGB0L7QsiDQtNC+INC60L7QvdGG0LAg0LTQvdGPXG4gICAgICAgICAgICB2YXIgaG91cnMgPSBkaWZmICUgMjQ7XG4gICAgICAgICAgICBpZihob3VycyA8IDEwKSBob3VycyA9IFwiMFwiK2hvdXJzO1xuICAgICAgICAgICAgdmFyIGRheXMgPSBNYXRoLmZsb29yKGRpZmYgLyAyNCk7XG5cbiAgICAgICAgICAgIHZhciAkZCA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX2RheXMnKTtcbiAgICAgICAgICAgIHZhciAkaCA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX2hvdXJzJyk7XG4gICAgICAgICAgICB2YXIgJG0gPSAkKGNvdW50ZG93bikuZmluZCgnLmNvdW50ZG93bl9faXRlbV9taW51dGVzJyk7XG4gICAgICAgICAgICB2YXIgJHMgPSAkKGNvdW50ZG93bikuZmluZCgnLmNvdW50ZG93bl9faXRlbV9zZWNvbmRzJyk7XG5cbiAgICAgICAgICAgICRkLmRhdGEoJ3ZhbCcsIGRheXMpLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChkYXlzKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCRkLCAzNjUpO1xuICAgICAgICAgICAgJGguZGF0YSgndmFsJywgaG91cnMpLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChob3Vycyk7XG4gICAgICAgICAgICB1cGRhdGVQcm9ncmVzcygkaCwgMjQpO1xuICAgICAgICAgICAgJG0uZGF0YSgndmFsJywgbWluKS5maW5kKCcuY291bnRkb3duX19kaWdpdCcpLnRleHQobWluKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCRtLCA2MCk7XG4gICAgICAgICAgICAkcy5kYXRhKCd2YWwnLCBzZWMpLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChzZWMpO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJHMsIDYwKTtcblxuICAgICAgICAgICAgLy8g0YHQu9C10LTRg9GO0YnQuNC5INGA0LDQtyDQstGL0LfRi9Cy0LDQtdC8INGB0LXQsdGPLCDQutC+0LPQtNCwINC30LDQutC+0L3Rh9C40YLRgdGPINGC0LXQutGD0YnQsNGPINGB0LXQutGD0L3QtNCwXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZSwgbWlsbGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KHVwZGF0ZSwgMCk7XG59XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5jb3VudGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdXBkYXRlcih0aGlzLCAkKHRoaXMpLmRhdGEoJ3RpbWUnKSk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICQoJy5mb3JtLW9yZGVyJykudmFsaWRhdGUoXG4gICAgICAge1xuICAgICAgICAgICBvbmtleXVwOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIG9uZm9jdXNvdXQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgZXJyb3JFbGVtZW50OiAnZGl2JyxcbiAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICBlcnJvci5hZGRDbGFzcygnZm9ybS1tc2cgZm9ybS1tc2dfZXJyb3InKS5pbnNlcnRBZnRlcihlbGVtZW50LmNsb3Nlc3QoJy50ZXh0LWZpZWxkLCAuY2hlY2tib3gsIC5yYWRpbycpKTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICk7XG59KTsiLCJmdW5jdGlvbiBoYXNWYWwoKSB7XG4gICAgJCgnLnRleHQtZmllbGQnKS5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3RleHQtZmllbGRfaGFzLXZhbCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygndGV4dC1maWVsZF9oYXMtdmFsJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgaGFzVmFsKCk7XG59KTtcblxuJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgIGhhc1ZhbCgpO1xuICAgICQoJ1tkYXRhLW1hc2tdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykubWFzaygkKHRoaXMpLmRhdGEoJ21hc2snKSk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5jb2xsYXBzZS1ib3hfX2J0bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRjb2xsYXBzZUJveCA9ICQodGhpcykuZmFkZU91dCg1MDApLmNsb3Nlc3QoJy5jb2xsYXBzZS1ib3gnKTtcbiAgICAgICAgJGNvbGxhcHNlQm94LnRvZ2dsZUNsYXNzKCdjb2xsYXBzZS1ib3hfb3BlbmVkJyk7XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcucmV2aWV3cy1saXN0LnNsaWNrLXNsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgIHNwZWVkOiAzMDAsXG4gICAgICAgIGZhZGU6IGZhbHNlLFxuICAgICAgICBjc3NFYXNlOiAnZWFzZS1vdXQnLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PC9idXR0b24+JyxcbiAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PC9idXR0b24+JyxcbiAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICBhc05hdkZvcjogJycsXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBwYXJzZUludCgkc2NyZWVuU21NaW4pKiRmb250U2l6ZVJvb3RDb21wdXRlZCAtIDEsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogcGFyc2VJbnQoJHNjcmVlbk1kTWluKSokZm9udFNpemVSb290Q29tcHV0ZWQgLSAxLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KS5vbignbGF6eUxvYWRlZCcsIGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGltYWdlLCBpbWFnZVNvdXJjZSkge1xuICAgICAgICAkKGltYWdlKS5jbG9zZXN0KCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnRhYnMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICR0YWJzID0gJCh0aGlzKSwgJHRhYnNOYXZJdGVtID0gJHRhYnMuZmluZCgnLnRhYnNfX25hdi1pdGVtJyksICR0YWJzQ29udGVudEl0ZW0gPSAkdGFicy5maW5kKCcudGFic19fY29udGVudC1pdGVtJyk7XG4gICAgICAgICR0YWJzTmF2SXRlbS5lcSgwKS5hZGRDbGFzcygndGFic19fbmF2LWl0ZW1fb3BlbmVkJyk7XG4gICAgICAgICR0YWJzQ29udGVudEl0ZW0uaGlkZSgpLmVxKDApLmFkZENsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuc2hvdygpO1xuXG4gICAgICAgICR0YWJzTmF2SXRlbS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHRhYnNOYXZJdGVtLm5vdCgkKHRoaXMpLmFkZENsYXNzKCd0YWJzX19uYXYtaXRlbV9vcGVuZWQnKSkucmVtb3ZlQ2xhc3MoJ3RhYnNfX25hdi1pdGVtX29wZW5lZCcpO1xuICAgICAgICAgICAgdmFyICRjdXJyZW50VGFiID0gJCgnW2RhdGEtaWQ9XCInICsgJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVsxXSArICdcIl0nKTtcbiAgICAgICAgICAgICR0YWJzQ29udGVudEl0ZW0ubm90KCRjdXJyZW50VGFiLmFkZENsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuZmFkZUluKDIwMCkpLnJlbW92ZUNsYXNzKCd0YWJzX19jb250ZW50LWl0ZW1fb3BlbmVkJykuaGlkZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkdGFicy5hZGRDbGFzcygndGFic19pbml0Jyk7XG4gICAgfSk7XG59KTsiLCJ2YXIgbWFwLCBtYXBFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcbmZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgdmFyIG15TGF0TG5nID0ge2xhdDogNTUuNzUyNTY1LCBsbmc6IDM3LjYxNDYyNH07XG5cbiAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBFbCwge1xuICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgY2VudGVyOiBteUxhdExuZyxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gICAgfSk7XG5cbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIHBvc2l0aW9uOiBteUxhdExuZyxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIHRpdGxlOiAnJ1xuICAgIH0pO1xufVxubWFwRWwgPyBpbml0TWFwKCkgOiBudWxsOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJy5mb3JtLWZlZWRiYWNrJykudmFsaWRhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ua2V5dXA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25mb2N1c291dDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckVsZW1lbnQ6ICdkaXYnLFxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuYWRkQ2xhc3MoJ2Zvcm0tbXNnIGZvcm0tbXNnX2Vycm9yJykuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5jbG9zZXN0KCcudGV4dC1maWVsZCwgLmNoZWNrYm94LCAucmFkaW8nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWZhbmN5Ym94LS1zaW5nbGVdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIGtleWJvYXJkOiBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgdG91Y2g6IGZhbHNlLFxuICAgICAgICBvbkluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1mYW5jeWJveC0tZ3JvdXBdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5IGhpZGVcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuIGhpZGVcIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnMgaGlkZVwiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIHRvdWNoOiBmYWxzZSxcbiAgICAgICAgb25Jbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtZmFuY3lib3gtLWdhbGxlcnldXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiBmYWxzZSxcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXG4gICAgICAgIGJ0blRwbCA6IHtcbiAgICAgICAgICAgIHNsaWRlU2hvdyAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXBsYXkgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1wbGF5XCIgdGl0bGU9XCJ7e1BMQVlfU1RBUlR9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBmdWxsU2NyZWVuIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1mdWxsc2NyZWVuIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tZnVsbHNjcmVlblwiIHRpdGxlPVwie3tGVUxMX1NDUkVFTn19XCI+PC9idXR0b24+JyxcbiAgICAgICAgICAgIHRodW1icyAgICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXRodW1icyBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXRodW1ic1wiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjbG9zZSAgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxuXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXG4gICAgICAgICAgICAvLyBpZiBcInNtYWxsQnRuXCIgb3B0aW9uIGlzIG5vdCBzZXQgdG8gZmFsc2VcbiAgICAgICAgICAgIHNtYWxsQnRuICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgfVxuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuc2hhcmUtYm94X19pdGVtX3NoYXJlLWJ0bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2hhcmUtYm94JykudG9nZ2xlQ2xhc3MoJ3NoYXJlLWJveF92aXNpYmxlX2FsbCcpO1xuICAgIH0pO1xufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS10b2dnbGU9Y29sbGFwc2libGVdJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5jb2xsYXBzaWJsZScpLmZpbmQoJy5jb2xsYXBzaWJsZV9faW5uZXInKS5zbGlkZVRvZ2dsZSgyMDApO1xuICAgIH0pO1xufSk7Il19
