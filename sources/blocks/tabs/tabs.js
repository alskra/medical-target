$(function () {
    $('.tabs').each(function () {
        var $tabs = $(this), $tabsNavItem = $tabs.find('.tabs__nav-item'), $tabsContentItem = $tabs.find('.tabs__content-item');
        $tabsNavItem.eq(0).addClass('tabs__nav-item_opened');
        $tabsContentItem.hide().eq(0).addClass('tabs__content-item_opened').show();

        $tabsNavItem.on('click', function (e) {
            e.preventDefault();
            $tabsNavItem.not($(this).addClass('tabs__nav-item_opened')).removeClass('tabs__nav-item_opened');
            var $currentTab = $('[data-id="' + $(this).attr('href').split('#')[1] + '"]');
            $tabsContentItem.not($currentTab.addClass('tabs__content-item_opened').fadeIn(200)).removeClass('tabs__content-item_opened').hide();
        });

        $tabs.addClass('tabs_init');
    });
});