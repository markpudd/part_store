'use strict';

var configControllers = angular.module('config', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/configs.html/:cid', {
        templateUrl: 'partials/config',
        controller: 'ConfigController'
    }).when('/configs.html', {
        templateUrl: 'partials/configs',
        controller: 'ConfigsController'
    });
}]);



configControllers.controller('ConfigsController', ['$scope', '$http', function($scope, $http) {
    $http.get('/configs').success(function(data) {
        $scope.configs = data;
    });
}]);

configControllers.controller('ConfigController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    $scope.submit_type = 'POST';

    $scope.config = {
        fields: []
    };
    $scope.init = function() {
        if ($routeParams.cid != "new") {
            $http.get('/configs/' + $routeParams.cid).success(function(data) {
                $scope.config = data;
            });
            $scope.submit_type = 'PUT';
        }

    }

    $scope.submit = function() {

    };

    $scope.remove = function(index) {
        $scope.config.fields.splice(index, 1);
    };




    $scope.add = function() {
        $scope.config.fields.push({
            "name": "",
            "key": "",
            "type": "select",
            "dataType": "uint_8",
            "values": []
        });
    };

    $scope.submit = function() {
        if ($scope.submit_type == 'POST') {
            for (var i = 0; i < $scope.config.fields.length; i++) {
                if (typeof $scope.config.fields[i].values === 'string') {
                    $scope.config.fields[i].values = $scope.config.fields[i].values.split(',');
                }
            }
            $http({
                method: 'POST',
                url: '/configs',
                data: $scope.config
            });
        } else {
            $http({
                method: 'PUT',
                url: '/configs/' + $scope.config._id,
                data: $scope.config
            });
        }
    };


}]);
