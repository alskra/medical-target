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