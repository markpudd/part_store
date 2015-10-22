'use strict';

// Declare app level module which depends on views, and components
angular.module('PartFinder', [
  'ngRoute',
  'part',
  'pick_list',
  'store',
  'config',
  'partsService',
  'storesService',
  'configsService',
  'pickListsService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/parts.html/cat/Tiles'});
}]);

