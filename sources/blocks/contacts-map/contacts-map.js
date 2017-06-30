var map, mapEl = document.getElementById('map');
function initMap() {
    var myLatLng = {lat: 55.752565, lng: 37.614624};

    var map = new google.maps.Map(mapEl, {
        zoom: 15,
        center: myLatLng,
        scrollwheel: false
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: ''
    });
}
mapEl ? initMap() : null;