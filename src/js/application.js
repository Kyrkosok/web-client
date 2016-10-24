var kyrksok = {
  endpoint: 'http://tools.wmflabs.org/churches',
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

  renderMarkers: function(south, west, north, east) {
    // #TODO
  },

  leaflet: function() {
    // #TODO
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
  kyrksok.renderChurch(church, function(data) {
    // if church is not found redirect
    if (data.church.length < 1) {
      window.location = 'http://kyrksok.se/404.html';
    }

    item = data.church[0];
    document.title = 'Kyrksök - ' + item.label;
    $('#church-title').text(item.label);
    $('#church-wikipedia').text(item.wp_description);
    $('#church-wikipedia-link').attr('href', kyrksok.wikipedia + item.wikipedia);
    $('#church-kringla').attr('href', kyrksok.kringla + item.kulturarvsdata);
    $('#church-bbr-link').attr('href', kyrksok.createBbrLink(item.kulturarvsdata));

    if (item.description !== '') {
      $('#church-bbr').html('<p>' + item.description.replace(/(\n)+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>');
    } else {
      $('#church-bbr').remove();
      $('#bbr-expand').remove();
      $('#bbr-heading').remove();
    }

    if (item.commons !== '') {
      $('#church-commons').attr('href', kyrksok.commons + 'Category:' + item.commons);
    } else {
      $('#church-commons').remove();
    }

    $('#church-header').attr('alt', item.label);
    $('#church-header').attr('src', item.image_original);
    $('#church-commons-link').attr('href', kyrksok.commons + item.image);
  });
// only trigger 404 if we are at church.html
} else if(window.location.pathname.indexOf('church.html') !== -1) {
  window.location = 'http://kyrksok.se/404.html';
}

var bbrExpanded = false;
$('#bbr-expand').click(function() {
  if (!bbrExpanded) {
    $('#church-bbr').css('height', '100%');
    $('#bbr-expand').text('Visa mindre');
    bbrExpanded = true;
  } else {
    $('#church-bbr').css('height', '54px');
    $('#bbr-expand').text('Expandera');
    bbrExpanded = false;
  }
});

$('#search-btn').click(function() {
  if ($('#search-box').val() !== '') {
    kyrksok.search($('#search-box').val(), function(data) {
      var listItems = '';
      if (data.churches.length > 0) {
        for (i = 0; i < data.churches.length; i++) {
          var item = data.churches[i];
          listItems = listItems + '<li><a href="church.html?church=' + item.wikidata + '"><div><img src="' + item.image_thumbnail + '"></div><strong>' + item.label + '</strong><p>' + item.wp_description + '</p></a></li>';
        }
      } else {
        listItems = '<li class="not-found"><strong>Inga kyrkor hittades.</strong><br><button id="search-not-found-btn">OK</button></li>';

        $('#results').on('click', '#search-not-found-btn', function() {
          $('#results').css('display', 'none');
          $('#results').html('');
        });
      }
      $('#results').html('<ul>' + listItems + '</ul>');
      $('#results').css('display', 'block');
    });
  }
});

// enter should also trigger search if #search-box has focus
$('#search-box').keypress(function(event) {
  if (event.keyCode == 13) {
    $('#search-btn').click();
  }
});
