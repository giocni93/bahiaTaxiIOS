var map;
var marker = null;
var geocoder = null;
function initMap() {
  geocoder = new google.maps.Geocoder;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      configurarMapa(pos);

      dibujarMarker(map,pos);

      geocodeLatLng(geocoder, map, pos);

      map.addListener('click', function(e) {
        var pos = e.latLng;
        dibujarMarker(map,pos);
        geocodeLatLng(geocoder, map, pos);
      });

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function configurarMapa(pos){
  var mapOptions = {
      zoom: 16,
      center: pos,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true
    };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function dibujarMarker(map,pos){
  if(marker != null){
      marker.setMap(null);
  }

    marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Mi posicion'
  });

  marker.setMap(map);
}

function geocodeLatLng(geocoder, map, pos) {
  geocoder.geocode({'location': pos}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var parte1 = results[0].address_components[1].long_name;
        var parte2 = results[0].formatted_address.split("#")[1].split("-")[0];
        document.getElementById("pPosicion").innerHTML = parte1 + " # " + parte2;
      } else {
        document.getElementById("pPosicion").innerHTML = "No se encontro direccion para esta ubicacion";
      }
    } else {
      window.alert('Fallo al obtener direccion, ' + status);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
