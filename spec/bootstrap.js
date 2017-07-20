var components = {};
components.search = require('./ui/components/search-test');

var pages = {};
pages.church = require('./ui/pages/church-test');
pages.map = require('./ui/pages/map-test');

var rootUrl = 'http://127.0.0.1:3000';

// test index.html
components.search(rootUrl, 'index');

// test church.html
components.search(rootUrl + '/church.html?church=10548139', 'church');
pages.church(rootUrl + '/church.html?church=10548139');

// test map.html
components.search(rootUrl + '/map.html', 'map');
pages.map(rootUrl + '/map.html');