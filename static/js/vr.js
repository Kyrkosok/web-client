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

var vrItems = {
  'Q10713923': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Vemdalens_kyrka_klotbild.jpg',
    commons: 'https://commons.wikimedia.org/wiki/File:Vemdalens_kyrka_klotbild.jpg',
  },
  'Q10501350': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/F%C3%B6rk%C3%A4rla_kyrka_20160421_06.jpg',
    commons: 'https://commons.wikimedia.org/wiki/File:Förkärla_kyrka_20160421_06.jpg',
  }
}

var q = getUrlParameter('q');
var data;
if (q) {
  if (vrItems[q]) {
    data = vrItems[q];
    document.getElementById('attribution').href = data.commons;
  } else {
    window.location = 'https://kyrksok.se/404.html';
  }
} else {
  window.location = 'https://kyrksok.se/404.html';
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);

var image = data.image;
var texture = new THREE.TextureLoader().load(image, function() {
  document.getElementById('loading-screen').style.display = 'none';
});

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square',
  textVRNotFoundTitle: 'Inget headset hittades',
  textExitVRTitle: 'Avsluta VR',
  textEnterVRTitle: 'Upptäck i VR'
};

var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('exit', function() {
  camera.quaternion.set(0, 0, 0, 1);
  camera.position.set(0, controls.userHeight, 0);
});

enterVRButton.on('hide', function() {
  document.getElementById('ui').style.display = 'none';
  document.getElementById('attribution').style.display = 'none';
});

enterVRButton.on('show', function() {
  document.getElementById('ui').style.display = 'inherit';
  document.getElementById('attribution').style.display = 'inline';
});

document.getElementById('vr-button').appendChild(enterVRButton.domElement);
document.getElementById('no-vr').addEventListener('click', function() {
  enterVRButton.requestEnterFullscreen();
});

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;

animate();

function animate() {
  effect.render(scene, camera);
  if (enterVRButton.isPresenting()) {
    controls.update();
  }
  requestAnimationFrame(animate);
}

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', onResize, false);

function onMouseDown(event) {
  event.preventDefault();
  interacting = true;
  pointerX = event.clientX;
  pointerY = event.clientY;
  savedLng = lng;
  savedLat = lat;
}

function onMouseMove(event) {
  if (interacting) {
    lng = ( pointerX - event.clientX ) * 0.1 + savedLng;
    lat = ( pointerY - event.clientY ) * 0.1 + savedLat;
  }
}

function onMouseUp(event) {
  event.preventDefault();
  interacting = false;
}

function onTouchDown(event) {
  event.preventDefault();
  interacting = true;
  pointerX = event.touches[0].clientX;
  pointerY = event.touches[0].clientY;
  savedLng = lng;
  savedLat = lat;
}

function onTouchMove(event) {
  if (interacting) {
    lng = ( pointerX - event.touches[0].clientX ) * 0.1 + savedLng;
    lat = ( pointerY - event.touches[0].clientY ) * 0.1 + savedLat;
  }
}

function onTouchEnd(event) {
  event.preventDefault();
  interacting = false;
}

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
