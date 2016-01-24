app.controller('DireccionController',["$scope","DireccionService", function($scope,DireccionService) {
  var map2 = null;
  var marker2 = null;
  var geocoder2 = null;
  var myPos2 = null;
  var posOri = null;

  $scope.banNuevo = true;

  $scope.banCargando = false;
  $scope.direcciones = [];
  $scope.direccion = {
    drCodigo : "",
    drNombre : "",
    drDireccion : "",
    drLatitud : "",
    drLongitud : "",
    drCliente : "",
  };

  init();
  initMap2();

  function init(){
    $scope.banCargando = true;
    cargarDirecciones();
  }

  $scope.actualizarDireccion = function(){
    if(document.getElementById("nombre").value.trim() == "" ||
    document.getElementById("direccion").value.trim() == ""){
      Materialize.toast("Todos los campos son obligatorios", 3000, 'rounded');
    }else{

      var obj = {
        nombre : document.getElementById("nombre").value.trim(),
        direccion : document.getElementById("direccion").value.trim(),
        latitud : myPos2.lat(),
        longitud : myPos2.lng(),
        idCliente : JSON.parse(sessionStorage.getItem("cliente")).idCliente
      };



     if($scope.banNuevo){
       var promise = DireccionService.post(obj);
       promise.then(function(d) {
           Materialize.toast(d.data.message, 3000, 'rounded');
           $('#modal1').closeModal();
           init();
       }, function(err) {
             alert("ERROR AL PROCESAR SOLICITUD DIRECCION");
             //console.log("Some Error Occured " + JSON.stringify(err));
       });
     }else{
       var promise = DireccionService.put($scope.direccion.drCodigo,obj);
       promise.then(function(d) {
           Materialize.toast(d.data.message, 3000, 'rounded');
           $('#modal1').closeModal();
           init();
       }, function(err) {
             alert("ERROR AL PROCESAR SOLICITUD DIRECCION");
             //console.log("Some Error Occured " + JSON.stringify(err));
       });
     }
    }
  }

  $scope.borrarDireccion = function(obj){
    var r = confirm("Seguro deseas borrar la direccion'"+obj.drNombre+"'");
    if (r == true) {
      var promise = DireccionService.delete(obj.drCodigo);
      promise.then(function(d) {
          Materialize.toast(d.data.message, 3000, 'rounded');
          $('#modal1').closeModal();
          init();
      }, function(err) {
            alert("ERROR AL PROCESAR SOLICITUD DIRECCION");
            //console.log("Some Error Occured " + JSON.stringify(err));
      });
    }
  };

  function cargarDirecciones(){
    var promise = DireccionService.getByCliente(JSON.parse(sessionStorage.getItem("cliente")).idCliente);
    promise.then(function(d) {
        if(d.data.length > 0){
          $scope.direcciones = d.data;
        }
        $scope.banCargando = false;
    }, function(err) {
        $scope.banCargando = false;
    });
  }

  $scope.abrirNuevo = function(){
    $scope.banNuevo = true;
    $scope.direccion = {
      drCodigo : "",
      drNombre : "",
      drDireccion : "",
      drLatitud : "",
      drLongitud : "",
      drCliente : "",
    };
    if(marker2 != null){
        marker2.setMap(null);
    }
    map2.setCenter(posOri, 16);
    $('#modal1').openModal();
  }

  $scope.abrirModal = function(obj){
    $scope.banNuevo = false;
    $scope.direccion = obj;
    var pos = new google.maps.LatLng($scope.direccion.drLatitud, $scope.direccion.drLongitud);
    map2.setCenter(pos, 16);
    dibujarMarker2(map2,pos);
    $('#modal1').openModal();
  };

  // mapa

  function initMap2() {
    geocoder2 = new google.maps.Geocoder;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        myPos2 = pos;
        posOri = pos;
        configurarMapa2(pos);

      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function configurarMapa2(pos){
    var mapOptions = {
        zoom: 16,
        center: pos,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true
      };
    map2 = new google.maps.Map(document.getElementById('map2'), mapOptions);
    map2.addListener('click', function(e) {
      var pos = e.latLng;
      myPos2 = pos;
      dibujarMarker2(map2,pos);
      geocodeLatLng2(geocoder2, map2, pos);
    });
  }

  function dibujarMarker2(map2,pos){
    if(marker2 != null){
        marker2.setMap(null);
    }

    var image = 'images/clienteicon.png';
    marker2 = new google.maps.Marker({
      position: pos,
      map: map2,
      title: 'Mi posicion',
      icon: image
    });

    marker2.setMap(map2);
  }

  function geocodeLatLng2(geocoder, map, pos) {
    geocoder.geocode({'location': pos}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          var parte1 = results[0].address_components[1].long_name;
          var parte2 = results[0].formatted_address.split("#")[1].split("-")[0];
          document.getElementById("direccion").value = parte1 + " # " + parte2;
          //$scope.direccion.drDireccion = parte1 + " # " + parte2;
        } else {
          document.getElementById("direccion").value = " ";
        }
      } else {
        window.alert('Fallo al obtener direccion, ' + status);
      }
    });
  }

}]);
