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