'use strict';

var partControllers = angular.module('part', ['ngRoute','partsService'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/categories.html', {
        templateUrl: 'partials/categories',
        controller: 'CategoriesController'
    }).when('/parts.html/cat/:category', {
        templateUrl: 'partials/parts',
        controller: 'PartsController'
    }).when('/parts.html/:pid', {
        templateUrl: 'partials/part',
        controller: 'PartController'
    }).when('/new_part.html/:pid', {
        templateUrl: 'partials/new_part',
        controller: 'PartController'
    }).when('/edit_part.html/:pid', {
        templateUrl: 'partials/new_part',
        controller: 'PartController'
    });
}]);



partControllers.controller('CategoriesController', ['$scope', '$http', 'Parts', function($scope,  $http,Parts) {
    $scope.categories = Parts.categories();
 //   $http.get('/categories').success(function(data) {
 //       $scope.categories = data;
  //  });
}]);


partControllers.controller('PartsController', ['$scope', '$http', '$routeParams', 'Parts', function($scope, $http, $routeParams, Parts) {
    $scope.categories =  Parts.categories( function() {
          $scope.categorySelected = $routeParams.category;
    });
    
    $scope.parts = Parts.query({category:$routeParams.category});

    $scope.categoryChanged = function() {
        $scope.parts = Parts.query({category:$scope.categorySelected});
    }

}]);


partControllers.controller('PartController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.config = [];
    $scope.editorEnabled = false;
    $scope.submit_type = 'POST';
    $scope.cfgSelected = {};
    $scope.part = {
        description: "",
    };
    $scope.parts_list = [];

    $scope.init = function() {
        if ($routeParams.pid != "new") {
            $scope.submit_type = 'PUT';
            $http.get('/parts/' + $routeParams.pid).success(function(data) {
                $scope.part = data;
                $scope.loadConfig();
            });
        } else {
            $scope.loadConfig();
        }

    }

    $scope.catChanged = function(index) {
        alert(index);
        var cc = pick_list.parts[index].picked_cat;
        alert(cc);
        $http.get('/parts/cat/' + cc).success(function(data) {
            $scope.parts_list = data;
        });
    };

    $scope.setupConfig = function() {

    }

    $scope.loadConfig = function() {
        $http.get('/configs').
        success(function(dd, status, headers, config) {
            $scope.config = dd;
            console.log(dd);
            $scope.setupConfig();

        }).
        error(function(data, status, headers, config) {
            // log error
        });
    }




    $scope.enableEditor = function() {
        $scope.editorEnabled = true;
    };

    $scope.disableEditor = function() {
        $scope.editorEnabled = false;
    };

    $scope.submit = function() {
        if ($scope.submit_type == 'PUT') {
            $http({
                method: 'PUT',
                url: '/parts/' + $scope.part._id,
                data: $scope.part
            });
        } else {
            $http({
                method: 'POST',
                url: '/parts',
                data: $scope.part
            });

        }
        $scope.disableEditor();
    };


}]);
