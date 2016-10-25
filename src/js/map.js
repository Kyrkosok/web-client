function renderMarkers() {
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
      if (xhr.status >= 200 && xhr.status < 300) {
        var result = JSON.parse(xhr.responseText);
        if (result.churches.length > 0) {

         //map.removeLayer(markers);
         markers.clearLayers();

          for (i = 0; i < result.churches.length; i++) {
            var item = result.churches[i];

            var location = new L.LatLng(item.lat, item.lon, true);
            var marker = new L.Marker(location).on('click', function() {
              window.location = 'http://kyrksok.se/church.html?church=' + item.wikidata;
            });
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
L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors & <a href="http://openstreetmap.se/">OpenStreetMap Sverige</a>',
  maxZoom: 18,
  subdomains: 'abc'
}).addTo(map);

var markers = L.markerClusterGroup();

map.on('moveend', function() {
  renderMarkers();
});

map.on('whenReady', function() {
  renderMarkers();
});

map.setView([62.42, 14.37], 5);