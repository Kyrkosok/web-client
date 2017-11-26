function renderMarkers() {
  document.getElementById('loading-screen').style.display = 'block';
  var xhr = new XMLHttpRequest();
  map.getBounds();
  xhr.open('GET', kyrksok.endpoint + '/churches/bbox?south=51.42&east=-3.38&north=70.45&west=32.12'
  , true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      document.getElementById('loading-screen').style.display = 'none';
      if (xhr.status >= 200 && xhr.status < 300) {
        var result = JSON.parse(xhr.responseText);
        if (result.churches.length > 0) {

          for (i = 0; i < result.churches.length; i++) {
            var item = result.churches[i];

            var location = new L.LatLng(item.lat, item.lon, true);
            var marker = new L.Marker(location);
            marker.bindPopup('<a href="church.html?church=' + item.wikidata + '">' + item.label + '</a>');
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

L.control.locate({
  strings: {
    title: 'Visa mig var jag är.'
  },
  locateOptions: {
    enableHighAccuracy: true,
    maxZoom: 13
  }
}).addTo(map);

var markers = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 60
});

map.on('load', function() {
  renderMarkers();
});

map.setView([62.42, 14.37], 5);
