var navbarComponent = angular.module('NavbarComponent', []);

navbarComponent.directive('navbar', function () {
    return {
        restrict: 'AE',
        templateUrl: 'components/navbar/navbar.html',
        controller: navbarController,
        controllerAs: 'navbar'
    }
});

function navbarController($state) {
    var _self = this;

}