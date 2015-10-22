'use strict';

var pickListControllers = angular.module('pick_list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pick_lists.html', {
        templateUrl: 'partials/pick_lists',
        controller: 'PickListsController'
    }).when('/new_pick_list.html/:pid', {
        templateUrl: 'partials/new_pick_list',
        controller: 'PickListController'
    }).when('/edit_pick_list.html/:pid', {
        templateUrl: 'partials/new_pick_list',
        controller: 'PickListController'
    }).when('/pick_lists_show.html/:pid', {
        templateUrl: 'partials/pick_lists_show',
        controller: 'PickListController'
    }).when('/pick_lists_play.html/:pid', {
        templateUrl: 'partials/pick_lists_play',
        controller: 'PlayPickListController'
    });
}]);



pickListControllers.controller('PickListsController', ['$scope', '$http', function($scope, $http) {
    $http.get('/pick_lists').success(function(data) {
        $scope.pick_lists = data;
    });
}]);


pickListControllers.controller('PickListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.pick_list = {
        parts: []
    };
    $scope.submit_type = 'POST';
    $scope.categories = [];
    $scope.parts_hash = {};

    $scope.init = function() {
        $http.get('/categories').success(function(data) {
            $scope.categories = data;
            if ($routeParams.pid != "new") {
                $scope.submit_type = 'PUT';
                $http.get('/pick_lists/' + $routeParams.pid).success(function(data) {
                    $scope.pick_list = data;
                    for (var i = 0; i < $scope.pick_list.parts.length; i++) {
                        $scope.catChange($scope.pick_list.parts[i].category);
                    }
                });
            }
        });
    };

    $scope.catChange = function(cat) {
        if (!$scope.parts_hash[cat]) {
            // make it an empty has so we only get the pick list once!
            $scope.parts_hash[cat] = {};
            $http.get('/parts/cat/' + cat).success(function(data) {
                $scope.parts_hash[cat] = data;
            });

        }
    }


    $scope.add = function() {

        $scope.pick_list.parts.push({
            "colour": "",
            "name": "",
            "part_id": "",
            "quantity": "1"
        });
    };

    $scope.remove = function(index) {
        $scope.pick_list.parts.splice(index, 1);
    };

    $scope.submit = function() {

        if ($scope.submit_type == 'POST') {
            $http({
                method: 'POST',
                url: '/pick_lists',
                data: $scope.pick_list
            });
        } else {
            $http({
                method: 'PUT',
                url: '/pick_lists/' + $scope.pick_list._id,
                data: $scope.pick_list
            });
        }
    };
}]);


pickListControllers.controller('PlayPickListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $http.get('/pick_lists/' + $routeParams.pid).success(function(data) {
        $scope.pick_list = data;
        $scope.step = 0;
        $scope.no_step = $scope.pick_list.parts.length;
        $scope.current_part = {}


        $http.get('/parts/' + $scope.pick_list.parts[$scope.step].part_id).success(function(pdata) {
            $scope.current_part = pdata;
            $scope.loc = $scope.current_part.location;
        });

        $scope.next = function() {

            if ($scope.step < ($scope.no_step - 1)) {
                $scope.step = $scope.step + 1;
                $http.get('/parts/' + $scope.pick_list.parts[$scope.step].part_id).success(function(pdata) {
                    $scope.current_part = pdata;
                    $scope.loc = $scope.current_part.location;
                });
            };
        };

        $scope.prev = function() {
            if ($scope.step > 0) {
                $scope.step = $scope.step - 1;
                $http.get('/parts/' + $scope.pick_list.parts[$scope.step].part_id).success(function(pdata) {
                    $scope.current_part = pdata;
                    $scope.loc = $scope.current_part.location;
                });
            };
        };
    });
}]);
