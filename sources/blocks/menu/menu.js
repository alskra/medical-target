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