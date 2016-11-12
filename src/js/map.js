function renderMarkers() {
  $('#loading-screen-map').css('display', 'block');
  var xhr = new XMLHttpRequest();
  map.getBounds();
  xhr.open('GET', kyrksok.endpoint + '/churches/bbox?south='
    + map.getBounds()._southWest.lat + '&east='
    + map.getBounds()._southWest.lng + '&north='
    + map.getBounds()._northEast.lat + '&west='
    + map.getBounds()._northEast.lng
  , true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      $('#loading-screen-map').css('display', 'none');
      if (xhr.status >= 200 && xhr.status < 300) {
        var result = JSON.parse(xhr.responseText);
        if (result.churches.length > 0) {

          for (i = 0; i < result.churches.length; i++) {
            var item = result.churches[i];

            var location = new L.LatLng(item.lat, item.lon, true);
            var marker = new L.Marker(location);
            marker.bindPopup('<a href="http://kyrksok.se/church.html?church=' + item.wikidata + '">' + item.label + '</a>');
            markers.addLayer(marker);
          }
          map.addLayer(markers);
        }
      }
    }
  };
  xhr.send();
}

map = L.map('leaflet');
L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors & <a href="http://openstreetmap.se/">OpenStreetMap Sverige</a>',
  maxZoom: 18,
  subdomains: 'abc'
}).addTo(map);

var markers = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 60
});

map.on('load', function() {
  renderMarkers();
});

map.setView([62.42, 14.37], 5);
