var webSocketProvider = angular.module("WebSocketProvider");

webSocketProvider.service("websocket", function ($rootScope, $q, WS) {
    var _self = this;
    _self.socket = create(WS.URL);
    $rootScope.socket = _self.socket;
    _self.subscribers = {};
    _self.request = { "type": "", "scope": "", "data": "", "action": "" };

    $rootScope.socket.onclose = function(m){
        console.log(m);
        _self.socket = create(WS.URL);
    };

    $rootScope.$on('$locationChangeSuccess', function () {
        for (property in _self.subscribers) {
            _self.request.type = property;
            _self.request.action = "STOP";

            console.log(_self.request);
            send(_self.socket, _self.request);
        }

        _self.subscribers = {};
    });

    return {
        isOpen: function () {
            return isOpen(_self.socket, $q).then(function (data) {
                return data;
            });
        },
        connect: function () {
            return connect(_self.socket, $q, WS.URL).then(function (data) {
                return data;
            });
        },
        subscribe: function (type, scope, data, callback) {
            return subscribe(_self.socket, _self.request, _self.subscribers, $q, type, scope, data, callback).then(function (data) {
                return data;
            });
        },
        unsubscribe: function (type, callback) {
            return unsubscribe(_self.socket, _self.request, _self.subscribers, $q, type, callback).then(function (data) {
                return data;
            });
        },
        sendMessage: function (message) {
            send(_self.socket, message);
        },
        disconnect: function () {
            return disconnect(_self.socket, $q).then(function (data) {
                return data;
            });
        }
    }
});

function create(URL) {
    var url = URL.protocol + "://" + URL.host + ":" + URL.port + URL.location;
    var socket = new WebSocket(url);
    // socket.onopen = function () {
    //     console.log("socket opened");
    // };
    return socket;
}

function subscribe(socket, request, subscribers, q, type, scope, data, callback) {
    var async = q.defer();

    request.type = type;
    request.scope = scope;
    request.action = "START";
    request.data = data;

    if (angular.isUndefined(subscribers[type])) {
        subscribers[type] = [];
        subscribers[type].push(callback);
        console.log(request);
        socket.send(JSON.stringify(request));
    } else {
        subscribers[type].push(callback);
    }

    socket.onmessage = function (message) {
        var data = JSON.parse(message.data);
        for (var i = 0; i < subscribers[data.type].length; i++) {
            subscribers[data.type][i](data);
        }
    };

    return async.promise;
}

function send(socket, message) {
    if (socket.readyState === 1) {
        if (typeof message === "string")
            socket.send(message);
        else
            socket.send(JSON.stringify(message));
    }

    return;
}

function unsubscribe(socket, request, subscribers, q, type, callback) {
    var async = q.defer();
    request.type = type;
    request.action = "STOP";
    request.data = null;
    request.scope = null;

    for (var i = 0; i < subscribers[type].length; i++) {
        if ((subscribers[type][i]).toString() == callback.toString()) {
            (subscribers[type]).splice(i, 1);

            if (subscribers[type].length == 0) {
                socket.send(JSON.stringify(request));
            }
        }
    }

    async.resolve({ "unsubscribed": true });
    return async.promise;
}

function connect(socket, q, url) {
    var async = q.defer();

    socket.onopen = function () {
        async.resolve({ "connected": true });
    };

    socket.onerror = function (error) {
        async.reject({ "connected": false, "error": error.message });
    };

    return async.promise;
}

function disconnect(socket, q) {
    console.log("calling ")
    var async = q.defer();

    if (socket.readyState === 1) {
        console.log("closing");
        socket.close();
    }

    async.resolve({ "disconnected": true });
    return async.promise;
}

function isOpen(socket, q) {
    var async = q.defer();

    var x = setInterval(function () {
        switch (socket.readyState) {
            case 0:
                async.reject({ "opened": false });
                break;

            case 1:
                async.resolve({ "opened": true });
                break;

            case 2:
                async.reject({ "opened": false });
                break;

            case 3:
                async.reject({ "opened": false });
                break;
        }
    }, 100);

    return async.promise;
}