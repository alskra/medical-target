var $screenSm = 768, $screenMd = 1024, $screenLg = 1280;

var $fontSizeRoot = 16;

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
        if (Modernizr.mq('(max-width: ' + ($screenMd - 1) + 'px)')) {
            if (!$(e.target).closest('.menu__item_submenu>.menu__btn>.menu__icon').length) {
                $('.menu__submenu').removeClass('opened').hide().parent().removeClass('opened');
            }
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
        prevArrow: '<button type="button" class="slick-prev icon icon-angle-left"></button>',
        nextArrow: '<button type="button" class="slick-next icon icon-angle-right"></button>',
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
    $("[data-fancybox]").fancybox({
        smallBtn : 'auto',
        autoFocus : false,
        btnTpl : {
            slideShow  : '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
            fullScreen : '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
            thumbs     : '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
            close      : '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn   : '<button data-fancybox-close class="fancybox-close-small glyphicon glyphicon-close-2 hide" title="{{CLOSE}}"></button>'
        },
        onInit: function () {
            $('<button data-fancybox-close class="fancybox-close-small glyphicon glyphicon-close-2" title="Close"></button>')
                .prependTo('.fancybox-inner');
        },
        beforeClose: function () {
            $('.fancybox-close-small').fadeOut(366);
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuanMiLCJhc2lkZS1zbGlkZW91dC5qcyIsImZvcm0tc2VhcmNoLmpzIiwibWVudS5qcyIsImhlYWRlci5qcyIsInNsaWRlci1tYWluLmpzIiwiY291bnRkb3duLmpzIiwiZm9ybS1vcmRlci5qcyIsInRleHQtZmllbGQuanMiLCJtb2RhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciAkc2NyZWVuU20gPSA3NjgsICRzY3JlZW5NZCA9IDEwMjQsICRzY3JlZW5MZyA9IDEyODA7XG5cbnZhciAkZm9udFNpemVSb290ID0gMTY7XG5cbnZhciAkc2NyZWVuU21NaW4gPSAkc2NyZWVuU20vJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuU21NaW4gPSAnICsgJHNjcmVlblNtTWluICsgJyAoJyArICRzY3JlZW5TbSArICdweCknKTtcbnZhciAkc2NyZWVuTWRNaW4gPSAkc2NyZWVuTWQvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuTWRNaW4gPSAnICsgJHNjcmVlbk1kTWluICsgJyAoJyArICRzY3JlZW5NZCArICdweCknKTtcbnZhciAkc2NyZWVuTGdNaW4gPSAkc2NyZWVuTGcvJGZvbnRTaXplUm9vdCArICdlbSc7IGNvbnNvbGUubG9nKCckc2NyZWVuTGdNaW4gPSAnICsgJHNjcmVlbkxnTWluICsgJyAoJyArICRzY3JlZW5MZyArICdweCknKTtcblxudmFyICRzY3JlZW5Yc01heCA9ICgkc2NyZWVuU20gLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5Yc01heCA9ICcgKyAkc2NyZWVuWHNNYXgpO1xudmFyICRzY3JlZW5TbU1heCA9ICgkc2NyZWVuTWQgLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5TbU1heCA9ICcgKyAkc2NyZWVuU21NYXgpO1xudmFyICRzY3JlZW5NZE1heCA9ICgkc2NyZWVuTGcgLSAxKS8kZm9udFNpemVSb290ICsgJ2VtJzsgY29uc29sZS5sb2coJyRzY3JlZW5NZE1heCA9ICcgKyAkc2NyZWVuTWRNYXgpO1xuIiwiJChmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRhc2lkZVNsaWRlb3V0PSQoJy5hc2lkZS1zbGlkZW91dCcpLCBzbGlkZW91dDtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5hc2lkZVNsaWRlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoTW9kZXJuaXpyLm1xKCcobWF4LXdpZHRoOiAnICsgJHNjcmVlblNtTWF4ICsgJyknKSkge1xuICAgICAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykuYXBwZW5kVG8oJGFzaWRlU2xpZGVvdXQpO1xuICAgICAgICAgICAgJCgnLm1lbnUnKS5hcHBlbmRUbygkYXNpZGVTbGlkZW91dCk7XG5cbiAgICAgICAgICAgIGlmICghJGFzaWRlU2xpZGVvdXQuaGFzQ2xhc3MoJ3NsaWRlb3V0LWluaXQnKSkge1xuICAgICAgICAgICAgICAgIHNsaWRlb3V0ID0gbmV3IFNsaWRlb3V0KHtcbiAgICAgICAgICAgICAgICAgICAgJ3BhbmVsJzogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndyYXBwZXInKSxcbiAgICAgICAgICAgICAgICAgICAgJ21lbnUnOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXNpZGUtc2xpZGVvdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmcnOiAyNjAsXG4gICAgICAgICAgICAgICAgICAgICd0b2xlcmFuY2UnOiA3MFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRhc2lkZVNsaWRlb3V0LmFkZENsYXNzKCdzbGlkZW91dC1pbml0Jyk7XG5cbiAgICAgICAgICAgICAgICBzbGlkZW91dC5vbignYmVmb3Jlb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaGVhZGVyJykuY3NzKHsncG9zaXRpb24nOiAnYWJzb2x1dGUnLCAndG9wJzogJCh3aW5kb3cpLnNjcm9sbFRvcCgpfSk7XG4gICAgICAgICAgICAgICAgfSkub24oJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uKHRyYW5zbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcicpLmNzcyh7J3Bvc2l0aW9uJzogJ2Fic29sdXRlJywgJ3RvcCc6ICQod2luZG93KS5zY3JvbGxUb3AoKX0pO1xuICAgICAgICAgICAgICAgIH0pLm9uKCdvcGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51JykuYWRkQ2xhc3MoJ2hlYWRlcl9fdG9nZ2xlLW1lbnVfb3BlbmVkIGdseXBoaWNvbi1jbG9zZScpLnJlbW92ZUNsYXNzKCdnbHlwaGljb24tbmF2Jyk7XG4gICAgICAgICAgICAgICAgfSkub24oJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5oZWFkZXInKS5jc3Moeydwb3NpdGlvbic6ICcnLCAndG9wJzogJyd9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhlYWRlcl9fdG9nZ2xlLW1lbnUnKS5yZW1vdmVDbGFzcygnaGVhZGVyX190b2dnbGUtbWVudV9vcGVuZWQgZ2x5cGhpY29uLWNsb3NlJykuYWRkQ2xhc3MoJ2dseXBoaWNvbi1uYXYnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlb3V0LnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogJyArICRzY3JlZW5NZE1pbiArICcpJykpIHtcbiAgICAgICAgICAgICQoJy5tZW51JykuYXBwZW5kVG8oJy5oZWFkZXJfX2lubmVyLWJvdHRvbT4uY29udGFpbmVyLWZsdWlkJyk7XG4gICAgICAgICAgICAkKCcuZm9ybS1zZWFyY2gnKS5hcHBlbmRUbygnLmhlYWRlcl9faW5uZXItYm90dG9tPi5jb250YWluZXItZmx1aWQnKTtcblxuICAgICAgICAgICAgaWYgKCRhc2lkZVNsaWRlb3V0Lmhhc0NsYXNzKCdzbGlkZW91dC1pbml0JykpIHtcbiAgICAgICAgICAgICAgICBzbGlkZW91dC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJGFzaWRlU2xpZGVvdXQucmVtb3ZlQ2xhc3MoJ3NsaWRlb3V0LWluaXQnKTtcblxuICAgICAgICAgICAgICAgICQoJy5oZWFkZXJfX3RvZ2dsZS1tZW51Jykub2ZmKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkudHJpZ2dlckhhbmRsZXIoJ3Jlc2l6ZS5hc2lkZVNsaWRlb3V0Jyk7XG59KTtcbiIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmZvcm0tc2VhcmNoX19idG4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2dseXBoaWNvbi1zZWFyY2ggZ2x5cGhpY29uLWNsb3NlJyk7XG4gICAgICAgICQoJy5tZW51JykudG9nZ2xlQ2xhc3MoJ2hpZGRlbi1tZCBoaWRkZW4tbGcnKTtcbiAgICAgICAgJCgnLmZvcm0tc2VhcmNoJykudG9nZ2xlQ2xhc3MoJ2Zvcm0tc2VhcmNoX29wZW5lZCcpO1xuICAgICAgICAkKCcuZm9ybS1zZWFyY2hfX2ZpZWxkJykuZm9jdXMoKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnVfX2l0ZW1fc3VibWVudT4ubWVudV9fYnRuPi5tZW51X19pY29uJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCcubWVudV9fc3VibWVudScpXG4gICAgICAgICAgICAubm90KCQodGhpcykucGFyZW50KCkubmV4dCgnLm1lbnVfX3N1Ym1lbnUnKS50b2dnbGVDbGFzcygnb3BlbmVkJykudG9nZ2xlKCkucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ29wZW5lZCcpLmVuZCgpKVxuICAgICAgICAgICAgLm5vdCgkKHRoaXMpLnBhcmVudHMoJy5tZW51X19zdWJtZW51JykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpLmhpZGUoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnb3BlbmVkJyk7XG4gICAgfSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKE1vZGVybml6ci5tcSgnKG1heC13aWR0aDogJyArICgkc2NyZWVuTWQgLSAxKSArICdweCknKSkge1xuICAgICAgICAgICAgaWYgKCEkKGUudGFyZ2V0KS5jbG9zZXN0KCcubWVudV9faXRlbV9zdWJtZW51Pi5tZW51X19idG4+Lm1lbnVfX2ljb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcubWVudV9fc3VibWVudScpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5oaWRlKCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcblxufSk7IiwiJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnNsaWRlci1tYWluJykuc2xpY2soe1xuICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgIHNwZWVkOiAzMDAsXG4gICAgICAgIGZhZGU6IHRydWUsXG4gICAgICAgIGNzc0Vhc2U6ICdsaW5lYXInLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2IGljb24gaWNvbi1hbmdsZS1sZWZ0XCI+PC9idXR0b24+JyxcbiAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0IGljb24gaWNvbi1hbmdsZS1yaWdodFwiPjwvYnV0dG9uPicsXG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICByZXNwb25zaXZlOiBbXG5cbiAgICAgICAgXVxuICAgIH0pLm9uKCdsYXp5TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgaW1hZ2UsIGltYWdlU291cmNlKSB7XG4gICAgICAgICQoaW1hZ2UpLmNsb3Nlc3QoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgfSk7XG59KTsiLCJmdW5jdGlvbiB1cGRhdGVQcm9ncmVzcyhpdGVtLCBiYXNlKSB7XG4gICAgdmFyICRiYXIgPSBpdGVtLmZpbmQoJy5jb3VudGRvd25fX2JhcicpO1xuICAgIHZhciByID0gJGJhci5hdHRyKCdyJyk7XG4gICAgdmFyIGwgPSBNYXRoLlBJKihyKjIpO1xuICAgIHZhciBwY3QgPSAoKGJhc2UtaXRlbS5kYXRhKCd2YWwnKSkvYmFzZSkqbDtcbiAgICAkYmFyLmNzcyh7c3Ryb2tlRGFzaGFycmF5OiBsfSk7XG4gICAgJGJhci5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVyKGNvdW50ZG93biwgYmFzZVRpbWUpIHtcbiAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIHZhciBjdXIgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvtGB0YLQsNC70L7RgdGMINC80LjQu9C70LjRgdC10LrRg9C90LRcbiAgICAgICAgdmFyIGRpZmYgPSBuZXcgRGF0ZShiYXNlVGltZSkgLSBjdXI7IC8vY29uc29sZS5sb2coZGlmZik7XG5cbiAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDQvNC40LvQu9C40YHQtdC60YPQvdC0INC00L4g0LrQvtC90YbQsCDRgdC10LrRg9C90LTRi1xuICAgICAgICAgICAgdmFyIG1pbGxpcyA9IGRpZmYgJSAxMDAwO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi8xMDAwKTtcbiAgICAgICAgICAgIC8vINGB0LrQvtC70YzQutC+INGB0LXQutGD0L3QtCDQtNC+INC60L7QvdGG0LAg0LzQuNC90YPRgtGLXG4gICAgICAgICAgICB2YXIgc2VjID0gZGlmZiAlIDYwO1xuICAgICAgICAgICAgaWYoc2VjIDwgMTApIHNlYyA9IFwiMFwiK3NlYztcbiAgICAgICAgICAgIGRpZmYgPSBNYXRoLmZsb29yKGRpZmYvNjApO1xuICAgICAgICAgICAgLy8g0YHQutC+0LvRjNC60L4g0LzQuNC90YPRgiDQtNC+INC60L7QvdGG0LAg0YfQsNGB0LBcbiAgICAgICAgICAgIHZhciBtaW4gPSBkaWZmICUgNjA7XG4gICAgICAgICAgICBpZihtaW4gPCAxMCkgbWluID0gXCIwXCIrbWluO1xuICAgICAgICAgICAgZGlmZiA9IE1hdGguZmxvb3IoZGlmZi82MCk7XG4gICAgICAgICAgICAvLyDRgdC60L7Qu9GM0LrQviDRh9Cw0YHQvtCyINC00L4g0LrQvtC90YbQsCDQtNC90Y9cbiAgICAgICAgICAgIHZhciBob3VycyA9IGRpZmYgJSAyNDtcbiAgICAgICAgICAgIGlmKGhvdXJzIDwgMTApIGhvdXJzID0gXCIwXCIraG91cnM7XG4gICAgICAgICAgICB2YXIgZGF5cyA9IE1hdGguZmxvb3IoZGlmZiAvIDI0KTtcblxuICAgICAgICAgICAgdmFyICRkID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1fZGF5cycpO1xuICAgICAgICAgICAgdmFyICRoID0gJChjb3VudGRvd24pLmZpbmQoJy5jb3VudGRvd25fX2l0ZW1faG91cnMnKTtcbiAgICAgICAgICAgIHZhciAkbSA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX21pbnV0ZXMnKTtcbiAgICAgICAgICAgIHZhciAkcyA9ICQoY291bnRkb3duKS5maW5kKCcuY291bnRkb3duX19pdGVtX3NlY29uZHMnKTtcblxuICAgICAgICAgICAgJGQuZGF0YSgndmFsJywgZGF5cykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGRheXMpO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJGQsIDM2NSk7XG4gICAgICAgICAgICAkaC5kYXRhKCd2YWwnLCBob3VycykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KGhvdXJzKTtcbiAgICAgICAgICAgIHVwZGF0ZVByb2dyZXNzKCRoLCAyNCk7XG4gICAgICAgICAgICAkbS5kYXRhKCd2YWwnLCBtaW4pLmZpbmQoJy5jb3VudGRvd25fX2RpZ2l0JykudGV4dChtaW4pO1xuICAgICAgICAgICAgdXBkYXRlUHJvZ3Jlc3MoJG0sIDYwKTtcbiAgICAgICAgICAgICRzLmRhdGEoJ3ZhbCcsIHNlYykuZmluZCgnLmNvdW50ZG93bl9fZGlnaXQnKS50ZXh0KHNlYyk7XG4gICAgICAgICAgICB1cGRhdGVQcm9ncmVzcygkcywgNjApO1xuXG4gICAgICAgICAgICAvLyDRgdC70LXQtNGD0Y7RidC40Lkg0YDQsNC3INCy0YvQt9GL0LLQsNC10Lwg0YHQtdCx0Y8sINC60L7Qs9C00LAg0LfQsNC60L7QvdGH0LjRgtGB0Y8g0YLQtdC60YPRidCw0Y8g0YHQtdC60YPQvdC00LBcbiAgICAgICAgICAgIHNldFRpbWVvdXQodXBkYXRlLCBtaWxsaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQodXBkYXRlLCAwKTtcbn1cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmNvdW50ZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB1cGRhdGVyKHRoaXMsICQodGhpcykuZGF0YSgndGltZScpKTtcbiAgICB9KTtcbn0pOyIsIiQoZnVuY3Rpb24gKCkge1xuICAgJCgnLmZvcm0tb3JkZXInKS52YWxpZGF0ZShcbiAgICAgICB7XG4gICAgICAgICAgIG9ua2V5dXA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgb25mb2N1c291dDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICB9LFxuICAgICAgICAgICBlcnJvckVsZW1lbnQ6ICdkaXYnLFxuICAgICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgIGVycm9yLmFkZENsYXNzKCdmb3JtLW1zZyBmb3JtLW1zZ19lcnJvcicpLmluc2VydEFmdGVyKGVsZW1lbnQuY2xvc2VzdCgnLnRleHQtZmllbGQsIC5jaGVja2JveCwgLnJhZGlvJykpO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgKTtcbn0pOyIsImZ1bmN0aW9uIGhhc1ZhbCgpIHtcbiAgICAkKCcudGV4dC1maWVsZCcpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygndGV4dC1maWVsZF9oYXMtdmFsJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCd0ZXh0LWZpZWxkX2hhcy12YWwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuJChmdW5jdGlvbiAoKSB7XG4gICAgaGFzVmFsKCk7XG59KTsiLCIkKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtZmFuY3lib3hdXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgc21hbGxCdG4gOiAnYXV0bycsXG4gICAgICAgIGF1dG9Gb2N1cyA6IGZhbHNlLFxuICAgICAgICBidG5UcGwgOiB7XG4gICAgICAgICAgICBzbGlkZVNob3cgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1wbGF5IGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tcGxheVwiIHRpdGxlPVwie3tQTEFZX1NUQVJUfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZnVsbFNjcmVlbiA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtZnVsbHNjcmVlbiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWZ1bGxzY3JlZW5cIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICB0aHVtYnMgICAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC10aHVtYnMgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS10aHVtYnNcIiB0aXRsZT1cInt7VEhVTUJTfX1cIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgY2xvc2UgICAgICA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtY2xvc2UgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1jbG9zZVwiIHRpdGxlPVwie3tDTE9TRX19XCI+PC9idXR0b24+JyxcblxuICAgICAgICAgICAgLy8gVGhpcyBzbWFsbCBjbG9zZSBidXR0b24gd2lsbCBiZSBhcHBlbmRlZCB0byB5b3VyIGh0bWwvaW5saW5lL2FqYXggY29udGVudCBieSBkZWZhdWx0LFxuICAgICAgICAgICAgLy8gaWYgXCJzbWFsbEJ0blwiIG9wdGlvbiBpcyBub3Qgc2V0IHRvIGZhbHNlXG4gICAgICAgICAgICBzbWFsbEJ0biAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWNsb3NlLXNtYWxsIGdseXBoaWNvbiBnbHlwaGljb24tY2xvc2UtMiBoaWRlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXG4gICAgICAgIH0sXG4gICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtY2xvc2Utc21hbGwgZ2x5cGhpY29uIGdseXBoaWNvbi1jbG9zZS0yXCIgdGl0bGU9XCJDbG9zZVwiPjwvYnV0dG9uPicpXG4gICAgICAgICAgICAgICAgLnByZXBlbmRUbygnLmZhbmN5Ym94LWlubmVyJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuZmFuY3lib3gtY2xvc2Utc21hbGwnKS5mYWRlT3V0KDM2Nik7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyJdfQ==
