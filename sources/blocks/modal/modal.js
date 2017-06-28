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