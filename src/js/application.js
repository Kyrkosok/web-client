Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

var kyrksok = {
  endpoint: 'https://tools.wmflabs.org/churches',
  kringla: 'http://www.kringla.nu/kringla/objekt?referens=',
  wikipedia: 'https://sv.wikipedia.org/wiki/',
  commons: 'https://commons.wikimedia.org/wiki/',
  kulturarvsdata: 'http://kulturarvsdata.se/',

  renderChurch: function(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', kyrksok.endpoint + '/churches/' + id, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          typeof callback === 'function' && callback(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send();
  },

  search: function(text, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', kyrksok.endpoint + '/churches/label?text=' + text, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          typeof callback === 'function' && callback(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.send();
  },

  getUrlParameter: function(parameter) {
    var url = window.location.search.substring(1);
    var vars = url.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0].toLowerCase() == parameter.toLowerCase()) {
        return pair[1];
      }
    }
    return false;
  },

  createBbrLink: function(rawUri) {
    // taken from:
    // https://github.com/Abbe98/human-readable-kulturarvsdata
    String.prototype.insertAt = function(index, string) {
      return this.substr(0, index) + string + this.substr(index);
    }

    var re = new RegExp('\/.[^/]+(|\/)$');

    insertIndex = re.exec(rawUri)['index'];
    return kyrksok.kulturarvsdata + rawUri.insertAt(insertIndex, '/html');
  }
}

var church = kyrksok.getUrlParameter('church');
if (church) {
  document.getElementById('loading-screen').style.display = 'block';
  kyrksok.renderChurch(church, function(data) {
    // if church is not found redirect
    if (data.church.length < 1) {
      window.location = 'http://kyrksok.se/404.html';
    }

    church = data['church'][0];

    var mailText = 'mailto:bebyggelseregistret@raa.se?subject=Angående ' + church.label + ' - via kyrksok.se&body=I kyrkan med id: ' + church.kulturarvsdata + ' har jag följande att anmärka: ';
    
    document.title = 'Kyrksök - ' + church.label;
    document.getElementById('church-title').innerText = church.label;
    document.getElementById('church-report').setAttribute('href', mailText);
    document.getElementById('church-wikipedia').innerText = church.wp_description;
    document.getElementById('church-wikipedia-link').setAttribute('href',  kyrksok.wikipedia + church.wikipedia);
    document.getElementById('church-kringla').setAttribute('href', kyrksok.kringla + church.kulturarvsdata);
    document.getElementById('church-bbr-link').setAttribute('href', kyrksok.createBbrLink(church.kulturarvsdata));

    if (church.description !== '') {
      document.getElementById('church-bbr').innerHTML = '<p>' + church.description.replace(/(\n)+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
    } else {
      document.getElementById('church-bbr').remove();
      document.getElementById('bbr-expand').remove();
      document.getElementById('bbr-heading').remove();
    }

    if (church.commons !== '') {
      document.getElementById('church-commons').setAttribute('href', kyrksok.commons + 'Category:' + church.commons);
    } else {
      document.getElementById('church-commons').remove();
    }

    document.getElementById('church-header').setAttribute('alt', church.label);
    document.getElementById('church-header').setAttribute('src', church.image_original);
    document.getElementById('church-commons-link').setAttribute('href', kyrksok.commons + church.image);

    document.getElementById('loading-screen').style.display = 'none';

    if (document.getElementById('bbr-expand')) {
      var bbrExpanded = false;
      document.getElementById('bbr-expand').addEventListener('click', function() {
        if (!bbrExpanded) {
          document.getElementById('church-bbr').style.height = '100%';
          document.getElementById('bbr-expand').innerText = 'Visa mindre';
          document.getElementById('church-report').style.display = 'block';
          bbrExpanded = true;
        } else {
          document.getElementById('church-bbr').style.height = '54px';
          document.getElementById('bbr-expand').innerText = 'Expandera';
          document.getElementById('church-report').style.display = 'none';
          bbrExpanded = false;
        }
      });
    }
  });
// only trigger 404 if we are at church.html
} else if(window.location.pathname.indexOf('church.html') !== -1) {
  window.location = 'http://kyrksok.se/404.html';
}

document.getElementById('search-btn').addEventListener('click', function() {
  if (document.getElementById('search-box').value !== '') {
    kyrksok.search(document.getElementById('search-box').value, function(data) {
      var listItems = '';
      if (data.churches.length > 0) {
        for (i = 0; i < data.churches.length; i++) {
          var item = data.churches[i];
          listItems = listItems + '<li><a href="church.html?church=' + item.wikidata + '"><div><img src="' + item.image_thumbnail + '"></div><strong>' + item.label + '</strong><p>' + item.wp_description + '</p></a></li>';
        }
      } else {
        listItems = '<li class="not-found"><strong>Inga kyrkor hittades.</strong><br><button id="search-not-found-btn">OK</button></li>';

        document.getElementById('results').addEventListener('click', function(event) {
          if (event.target.id === 'search-not-found-btn') {
            document.getElementById('results').style.display = 'none';
            document.getElementById('results').innerHTML = '';
          }
        });
      }
      document.getElementById('results').innerHTML = '<ul>' + listItems + '</ul>';
      document.getElementById('results').style.display = 'block';
    });
  }
});

// enter should also trigger search if #search-box has focus
document.getElementById('search-box').addEventListener('keypress', function(event) {
  if (event.keyCode == 13) {
    document.getElementById('search-btn').click();
  }
});
