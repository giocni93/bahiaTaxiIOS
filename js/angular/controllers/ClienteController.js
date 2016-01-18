app.controller('ClienteController',["$scope","ClienteService", function($scope,ClienteService) {

  $scope.valEmail = false;
  $scope.msjError = "";
  init();

  $scope.usuario = {
    email : "",
    clave : ""
  };

  $scope.Cliente = {
      nombre: "",
      telefono: "",
      email: "",
      clave: ""
  };

  function init(){
    if (sessionStorage.getItem("cliente")) {
        location.href = "./home.html";
    }
  }

  $scope.registrar = function (){
      $scope.msjError="";
      if ($scope.valEmail){
          $scope.msjError = "Email ya se encuentra registrado, Verifique";
          return;
      }

      var object = {
          nombre: $scope.Cliente.nombres.toUpperCase(),
          telefono: $scope.Cliente.telefono,
          email: $scope.Cliente.email.toUpperCase(),
          clave: $scope.Cliente.clave,
          latitud : "0",
          longitud : "0",
          direccion : "",
          dir0 : "",
          dir1 : "",
          dir2 : "",
          dir3 : "",
          dir4 : "",
          dir5 : "",
          direccionOp : "",
          estado : 'ESPERA'
      };

      var promise = ClienteService.post(object);
      promise.then(function(d) {
          $scope.msjError = d.data.message + ', por Favor, Confirme su Cuenta';
          setTimeout ("location.href = '#/'", 3500);
          inicialize();
      }, function(err) {
              alert("ERROR AL PROCESAR SOLICITUD");
              console.log("Some Error Occured " + JSON.stringify(err));
      });
  };

  $scope.autenticar = function (){

      $scope.msjError = "Espere, por favor ... ";

      var object = {
          email: $scope.usuario.email,
          clave: $scope.usuario.clave
      };
     var promise = ClienteService.autenticar(object);
      promise.then(function(d) {
          if (d.data.message === "Correcto") {
              sessionStorage.setItem("cliente",d.data.request);
              //sessionStorage.setCliente(d.data.request);
              if (sessionStorage.getItem("cliente")) {
                  location.href = "./home.html";
              }
          } else{
              sessionStorage.clear();
              $scope.msjError = d.data.request;
          }
      }, function(err) {
              alert("ERROR AL PROCESAR SOLICITUD");
              console.log("Some Error Occured " + JSON.stringify(err));
      });
  };

  $scope.validarEmail = function () {
      $scope.valEmail = false;
      if (!$scope.Cliente.email) {
          return;
      }
      var promisePost = ClienteService.validarEmail($scope.Cliente.email.toUpperCase());
      promisePost.then(function (d) {
          if (d.data.Email) {
              $scope.valEmail = true;
          }
      }, function (err) {
          alert("ERROR AL PROCESAR VERIFICAR EMAIL");
          console.log("Some Error Occured " + JSON.stringify(err));
      });
  };

}]);
