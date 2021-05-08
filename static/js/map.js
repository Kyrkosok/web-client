function renderMarkers() {
  document.getElementById('loading-screen').style.display = 'block';
  var xhr = new XMLHttpRequest();
  map.getBounds();
  xhr.open('GET', '/map.json'
  , true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      document.getElementById('loading-screen').style.display = 'none';
      if (xhr.status >= 200 && xhr.status < 300) {
        var result = JSON.parse(xhr.responseText);
        if (result.length > 0) {

          for (i = 0; i < result.length; i++) {
            var item = result[i];

            var location = new L.LatLng(item.lat, item.lon, true);
            var marker = new L.Marker(location);
            marker.bindPopup('<a href="' + item.wikidata + '.html">' + item.label + '</a>');
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

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
