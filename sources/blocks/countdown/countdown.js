function updateProgress(item, base) {
    var $bar = item.find('.countdown__bar');
    var r = $bar.attr('r');
    var l = Math.PI*(r*2);
    var pct = ((base-item.data('val'))/base)*l;
    $bar.css({strokeDasharray: l});
    $bar.css({strokeDashoffset: pct});
}

function updater(countdown, baseTime) {
    function update() {
        var cur = new Date();
        // сколько осталось миллисекунд
        var diff = new Date(baseTime) - cur; //console.log(diff);

        if (diff > 0) {
            // сколько миллисекунд до конца секунды
            var millis = diff % 1000;
            diff = Math.floor(diff/1000);
            // сколько секунд до конца минуты
            var sec = diff % 60;
            if(sec < 10) sec = "0"+sec;
            diff = Math.floor(diff/60);
            // сколько минут до конца часа
            var min = diff % 60;
            if(min < 10) min = "0"+min;
            diff = Math.floor(diff/60);
            // сколько часов до конца дня
            var hours = diff % 24;
            if(hours < 10) hours = "0"+hours;
            var days = Math.floor(diff / 24);

            var $d = $(countdown).find('.countdown__item_days');
            var $h = $(countdown).find('.countdown__item_hours');
            var $m = $(countdown).find('.countdown__item_minutes');
            var $s = $(countdown).find('.countdown__item_seconds');

            $d.data('val', days).find('.countdown__digit').text(days);
            updateProgress($d, 365);
            $h.data('val', hours).find('.countdown__digit').text(hours);
            updateProgress($h, 24);
            $m.data('val', min).find('.countdown__digit').text(min);
            updateProgress($m, 60);
            $s.data('val', sec).find('.countdown__digit').text(sec);
            updateProgress($s, 60);

            // следующий раз вызываем себя, когда закончится текущая секунда
            setTimeout(update, millis);
        }
    }
    setTimeout(update, 0);
}

$(function () {
    $('.countdown').each(function () {
        updater(this, $(this).data('time'));
    });
});