var gl_resultado = {};
var app;
(function(){
    app = angular.module("bahiataxi", ['ngRoute','ng-currency']);

    app.config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider){
      $routeProvider
          .when("/",{
              templateUrl: 'vistas/login.html'
          })
          .when("/registro",{
              templateUrl: 'vistas/registro.html'
          })
          .otherwise({
              redirectTo:"/"
          });
    }]);


})();
