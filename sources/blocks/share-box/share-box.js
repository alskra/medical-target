$(function () {
    $('body').on('click', '.share-box__item_share-btn', function () {
        $(this).closest('.share-box').toggleClass('share-box_visible_all');
    });
});