'use strict';

var dashboardApp = angular.module('testDashApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'nvd3',
  'gridster',
  'ui.router',
  'NavbarComponent',
  'VideoComponent',
  'MapComponent',
  'CoordinatesComponent'
]);

dashboardApp.config(function ($stateProvider, $urlRouterProvider) {

  var home = {
    name: 'home',
    url: '/',
    abstract: true,
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl',
    controllerAs: 'home'
  };

  var dashboard = {
    name: 'dashboard',
    url: 'dashboard',
    templateUrl: 'views/dashboard.html',
    controller: 'DashboardCtrl',
    controllerAs: 'dashboard'
  };

  $stateProvider.state('home', home);
  $stateProvider.state('home.dashboard', dashboard);

  $urlRouterProvider.when("/", "/dashboard");
  $urlRouterProvider.otherwise("/");

});

dashboardApp.run(function ($state, $rootScope, $location) {
  $rootScope.gridsterOpts = {
    "minRows": 1,
    "maxRows": 1000,
    "columns": 12,
    "colWidth": "auto",
    "rowHeight": "84",
    "margins": [10, 10],
    "defaultSizeX": 2,
    "defaultSizeY": 1,
    "mobileBreakPoint": 600,
    "resizable": {
      "enabled": false
    },
    "draggable": {
      "enabled": true,
      "handle": ".title-header"
    }
  };

  $rootScope.connectionType = 'http';
  $rootScope.host = '10.162.161.11'; /*'10.162.161.24', 10.143.8.155, 10.162.164.129*/
  $rootScope.webRTCHost = '10.162.161.11'; /*'10.162.161.24', 10.143.8.155, 10.162.164.129*/
  $rootScope.webRTCPort = 3000;
  $rootScope.nodeServerPort = 3001;
});

$(document).ready(function () {
  Waves.attach('.waves');
  Waves.init();
});