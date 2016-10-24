var kyrksok = {
  endpoint: 'http://tools.wmflabs.org/churches',
  kringla: 'http://www.kringla.nu/kringla/objekt?referens=',
  wikipedia: 'https://sv.wikipedia.org/wiki/',
  commons: 'https://commons.wikimedia.org/wiki/',

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
  }
}

var church = kyrksok.getUrlParameter('church');
if (church) {
  kyrksok.renderChurch(church, function(data) {
    item = data.church[0];
    document.title = 'Kyrksök - ' + item.label;
    $('#church-title').text(item.label);
    $('#church-wikipedia').text(item.wp_description);
    $('#church-wikipedia-link').attr('href', kyrksok.wikipedia + item.wikipedia);
    $('#church-kringla').attr('href', kyrksok.kringla + item.kulturarvsdata);

    if (item.description !== '') {
      $('#church-bbr').html('<p>' + item.description.replace(/(\n)+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>');
    } else {
      $('#church-bbr').remove();
      $('#bbr-expand').remove();
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

$('#bbr-expand').click(function() {
  $('#church-bbr').css('height', '100%');
});

$('#search-btn').click(function() {
  if ($('#search-box').val() !== '') {
    kyrksok.search($('#search-box').val(), function(data) {
      var listItems = '';
      for (i = 0; i < data.churches.length; i++) {
        var item = data.churches[i];
        listItems = listItems + '<li><a href="church.html?church=' + item.wikidata + '"><div><img src="' + item.image_thumbnail + '"></div><strong>' + item.label + '</strong><p>' + item.wp_description + '</p></a></li>';
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
