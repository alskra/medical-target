$(function () {
    $('body').on('click', '[data-toggle=collapsible]', function () {
        $(this).closest('.collapsible').find('.collapsible__inner').slideToggle(200);
    });
});