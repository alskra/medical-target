$(function () {
    $('body').on('click', '.form-search__btn', function () {
        $(this).toggleClass('glyphicon-search glyphicon-close');
        $('.menu').toggleClass('hidden-md hidden-lg');
        $('.form-search').toggleClass('form-search_opened');
        $('.form-search__field').focus();
    });
});