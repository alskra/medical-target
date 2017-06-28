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
