$(function () {
    $('body').on('click', '.collapse-box__btn', function () {
        var $collapseBox = $(this).fadeOut(500).closest('.collapse-box');
        $collapseBox.toggleClass('collapse-box_opened');
    });
});