$(function () {
    $('.reviews-list.slick-slider').slick({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        fade: false,
        cssEase: 'ease-out',
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        autoplay: false,
        autoplaySpeed: 5000,
        zIndex: 1,
        lazyLoad: 'ondemand',
        asNavFor: '',
        responsive: [
            {
                breakpoint: parseInt($screenSmMin)*$fontSizeRootComputed - 1,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: parseInt($screenMdMin)*$fontSizeRootComputed - 1,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    }).on('lazyLoaded', function (event, slick, image, imageSource) {
        $(image).closest('.slick-slide').removeClass('loading');
    });
});