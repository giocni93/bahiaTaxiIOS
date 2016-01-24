app.controller('ServicioController',["$scope","ServicioService","DireccionService", function($scope,ServicioService,DireccionService) {
  $scope.uri = "http://localhost/htdocs/bahiataxis/";
  $scope.banTxtNombre = false;
  $scope.banServicio = 0;
  $scope.servicio = {};
  $scope.motivos = [];

  var markertaxista = null;
  var hilo;

  init();
  initMap();

  function init(){
    if (!sessionStorage.getItem("cliente")) {
        location.href = "./index.html";
    }else{
      var promise = ServicioService.verificarServicio(JSON.parse(sessionStorage.getItem("cliente")).idCliente);
      promise.then(function(d) {
          if(d.data.length > 0){
            verificarServicio();
            hiloServicio();
          }
      }, function(err) {
              alert("ERROR AL PROCESAR SOLICITUD");
              console.log("Some Error Occured " + JSON.stringify(err));
      });
    }
  }

  function cargarMotivos(){
    var promise = ServicioService.motivos();
    promise.then(function(d) {
        if(d.data.length > 0){
          $scope.motivos = d.data;
        }
    }, function(err) {
            alert("ERROR AL PROCESAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
    });
  }

  function verificarServicio(){
    var promise = ServicioService.verificarServicio(JSON.parse(sessionStorage.getItem("cliente")).idCliente);
    promise.then(function(d) {
        if(d.data.length > 0){
          $scope.servicio = d.data[0];
          if($scope.servicio.Estado == "Solicitado"){
            $scope.banServicio = 1;
            if(markertaxista != null){
                markertaxista.setMap(null);
            }
          }else {
            if($scope.servicio.Estado == "En curso"){
              $scope.banServicio = -1;
            }else{
              $scope.banServicio = 2;
            }

            $scope.servicio.rutaImg = $scope.uri + $scope.servicio.rutaImg;

            var pos = {
              lat: Number($scope.servicio.Latitud),
              lng: Number($scope.servicio.Longitud)
            };

            dibujarMarkertaxista(map,pos);
          }
        }else{
          $scope.banServicio = 0;
          if(markertaxista != null){
              markertaxista.setMap(null);
          }
          clearInterval(hilo);
        }
    }, function(err) {
            alert("ERROR AL PROCESAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
    });
  }

  function hiloServicio(){
    hilo = setInterval(function(){
      verificarServicio();
    }, 10000);
  }

  function dibujarMarkertaxista(map,pos){
    if(markertaxista != null){
        markertaxista.setMap(null);
    }

    var image = 'images/taxista.png';
    markertaxista = new google.maps.Marker({
      position: pos,
      map: map,
      title: 'Taxista',
      icon: image
    });

    markertaxista.setMap(map);
  }

  $scope.cambiarEstadoBan = function(){
    $scope.banTxtNombre = !$scope.banTxtNombre;
  }

  $scope.abrirModal = function(){
    $('#modal1').openModal();
  }

  $scope.abrirMotivos = function(){
    cargarMotivos();
    $('#modal2').openModal();
  }

  $scope.cancelarServicio = function(){
      var vec = $scope.motivos;
      var motivo = "";
      var ban = false;
      for (var i = 0; i < vec.length; i++) {
        if(document.getElementById(vec[i].idCancelar).checked){
          ban = true;
          break;
        }
      }
      if(!ban){
        Materialize.toast('Debe seleccionar un motivo', 3000, 'rounded');
      }else{
        var idCliente = JSON.parse(sessionStorage.getItem("cliente")).idCliente;
        var obj = {
          idMotivo : vec[i].idCancelar,
          idServicio : $scope.servicio.idServicio,
          idPersona : $scope.servicio.idPersona
        };

        console.log(JSON.stringify(obj));

        var promise = ServicioService.cancelarServicio(idCliente,obj);
        promise.then(function(d) {
          Materialize.toast('Servicio cancelado', 2000, 'rounded');
            verificarServicio();
            $scope.cerrarMotivos();
        }, function(err) {
                alert("ERROR AL PROCESAR SOLICITUD");
                console.log("Some Error Occured " + JSON.stringify(err));
        });

      }

  };

  $scope.pedirTaxi = function(){
    var ban = true;
    if($scope.banTxtNombre){
      if(document.getElementById("nombre").value.trim() == ""){
        ban = false;
        Materialize.toast('Debe digitar un nombre', 2000, 'rounded');
      }
    }

    if(ban){
      var obj = {
        latitud : document.getElementById("latitud").value,
        longitud : document.getElementById("longitud").value,
        idCliente : JSON.parse(sessionStorage.getItem("cliente")).idCliente,
        descripcion : document.getElementById("descripcion").value,
        direccionOp : document.getElementById("pPosicion").value,
        categoria : "Todas"
      };

      console.log(JSON.stringify(obj));

      var promise = ServicioService.pedirTaxi(obj);
      promise.then(function(d) {
          alert(JSON.stringify(d.data));
          $('#modal1').closeModal();
      }, function(err) {
            alert("ERROR AL PROCESAR SOLICITUD");
            console.log("Some Error Occured " + JSON.stringify(err));
            $('#modal1').closeModal();
      });

      if($scope.banTxtNombre){
        guardarDireccion();
      }
    }
  }

  function guardarDireccion(){

    var obj = {
      nombre : document.getElementById("nombre").value,
      direccion : document.getElementById("pPosicion").value,
      latitud : myPos.lat,
      longitud : myPos.lng,
      idCliente : JSON.parse(sessionStorage.getItem("cliente")).idCliente
    };

    console.log(JSON.stringify(obj));

    var promise = DireccionService.post(obj);
    promise.then(function(d) {
        //alert(JSON.stringify(d.data));
    }, function(err) {
          //alert("ERROR AL PROCESAR SOLICITUD DIRECCION");
          //console.log("Some Error Occured " + JSON.stringify(err));
    });
  }

  $scope.cerrarModal = function(){
    $('#modal1').closeModal();
  }

  $scope.cerrarMotivos = function(){
    $('#modal2').closeModal();
  }


}]);
