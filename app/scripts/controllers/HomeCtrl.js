'use strict';

angular.module('testDashApp').controller('HomeCtrl', function ($scope, $state, $http) {

  var _self = this;

  init();

  function init() {

    // connectWS();
  }

  function connectWS() {
    websocket.connect().then(function(data){
      console.log("ws connection ", data)
    });
  }
});
