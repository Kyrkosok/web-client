Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

Array.prototype.contains = function(item) {
  var index = this.indexOf(item);

  if (index > -1) {
    return true;
  } else {
    return false;
  }
}



function getUrlParameter(parameter) {
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

var vrItems = ['Q10713923', 'Q10501350'];
var qid = window.location.pathname.replace('/', '').replace('.html', '');
if (vrItems.contains(qid)) {
  document.getElementById('vr-link').href = 'vr.html?q=' + qid;
  document.getElementById('vr-content').style.display = 'block';
}
