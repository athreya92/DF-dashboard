var mapComponent = angular.module('CoordinatesComponent', []);

mapComponent.directive('coordinatesComponent', function () {
    return {
        restrict: 'AE',
        scope: '',
        templateUrl: 'components/coordinates/coordinates.html',
        controller: coordinateController,
        controllerAs: 'coordinate'
    }
});

function coordinateController($scope, $timeout, $window, $rootScope) {
    var _self = this;

    _self.title = "Car Co-Ordinates";
    _self.centered = false;

}

