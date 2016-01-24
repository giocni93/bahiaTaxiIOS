app.service("ServicioService", function ($http) {

  this.pedirTaxi = function (servicio) {
      var req = $http.post(uri+'/api/servicio',servicio);
      return req;
  };

  this.verificarServicio = function (idCliente) {
      var req = $http.get(uri+'/api/cliente/'+idCliente+'/servicios');
      return req;
  };

  this.motivos = function () {
      var req = $http.get(uri+'/api/motivo/C');
      return req;
  };

  this.cancelarServicio = function (idCliente,obj) {
      var req = $http.put(uri+'/api/cliente/'+idCliente+'/cancelarServicio',obj);
      return req;
  };

});
