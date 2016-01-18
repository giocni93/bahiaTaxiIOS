app.service("ClienteService", function ($http) {

    this.validarEmail = function (email) {
        var req = $http.get(uri+'/api/cliente/'+email+'/email');
        return req;
    };

    this.post = function (cliente) {
        var req = $http.post(uri+'/api/cliente',cliente);
        return req;
    };

    this.autenticar = function (cliente) {
        var req = $http.post(uri+'/api/cliente/autenticar',cliente);
        return req;
    };



});
