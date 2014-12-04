

var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
            templateUrl: 'forecast.html',
            controller: 'forecastController'
        });
});


weatherApp.service('cityService', function () {
    this.city = "Brighton, East Sussex";
});

weatherApp.service('jsonCall',['$resource','$routeParams','cityService',function($resource,$routeParams, cityService){
    this.cityName = cityService.city;
   this.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', {
		callback: 'JSON_CALLBACK'},
		{get : {method: 'JSONP'}});
    this.days = $routeParams.days || 3;
    this.weatherResult = this.weatherAPI.get({q: this.cityName , cnt: this.days });	
}]);

weatherApp.controller('homeController', ['$scope', 'cityService','jsonCall', function ($scope, cityService, jsonCall) {
    $scope.weatherAPI = jsonCall.weatherAPI;
    $scope.weatherResult = jsonCall.weatherResult;
    $scope.days = jsonCall.days;
    $scope.cityName = cityService.city;
    $scope.$watch('cityName', function () {
        cityService.city = $scope.cityName;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function ($scope, $resource, $routeParams, cityService) {
    $scope.cityName = cityService.city;
	$scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', {
		callback: 'JSON_CALLBACK'},
		{get : {method: 'JSONP'}});
	$scope.days = $routeParams.days || 3
	$scope.weatherResult = $scope.weatherAPI.get({q: $scope.cityName , cnt: $scope.days });	

    $scope.toCelcius = function(kelvin){
        return Math.round(kelvin - 273.15);
        };
    $scope.toDay = function(date){
        return new Date(date*1000);
    };
    }                                            
]);

weatherApp.directive('weather', function () {
    return {
        templateUrl: 'directives/weather.html',
        restrict: 'E',
        replace: 'true'
    }
});

