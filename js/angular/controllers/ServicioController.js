app.controller('ServicioController',["$scope","ServicioService", function($scope,ServicioService) {

  init()

  function init(){
    if (!sessionStorage.getItem("cliente")) {
        location.href = "./index.html";
    }
  }

  $scope.salir = function(){
    sessionStorage.clear();
    init();
  }

}]);
