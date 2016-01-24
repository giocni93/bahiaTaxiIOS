app.service("DireccionService", function ($http) {

  this.getByCliente = function (idCliente) {
      var req = $http.get(uri+'/api/cliente/'+idCliente+'/direccion');
      return req;
  };

  this.post = function (obj) {
      var req = $http.post(uri+'/api/direccion',obj);
      return req;
  };

  this.put = function (id,obj) {
      var req = $http.put(uri+'/api/direccion/'+id,obj);
      return req;
  };

  this.delete = function (id) {
      var req = $http.delete(uri+'/api/direccion/'+id);
      return req;
  };


});
