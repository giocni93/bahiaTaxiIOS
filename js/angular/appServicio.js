var gl_resultado = {};
var app;
(function(){
    app = angular.module("bahiataxiServicio", ['ngRoute','ng-currency']);

    app.config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider){
      $routeProvider
          .when("/",{
              templateUrl: 'vistas/taxi.html'
          })
          .otherwise({
              redirectTo:"/"
          });
    }]);


})();
