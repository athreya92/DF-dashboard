var webSocketProvider = angular.module("WebSocketProvider");

webSocketProvider.constant('WS', {
    "URL": {
        "protocol": "ws",
        "port": 8080,
        "host": "10.71.11.110",
        "location": "/nas-server/websocket"
    },
    "REQUEST_TYPE": {
        "LOCATION": "LOCATION_REQUEST",
        "TEMPERATURE": "TEMPERATURE_REQUEST"
    },
    "SCOPE": {
        "SPECIFIC": "SPECIFIC",
        "ALL": "ALL"
    }
});