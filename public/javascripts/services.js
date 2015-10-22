var partsService = angular.module('partsService', ['ngResource']);

partsService.factory('Parts', ['$resource',
  function($resource){
    return $resource('/parts/:id', {}, {
        categories: {
            method: 'GET',
            url: '/categories',
            isArray: true
        },
        psection: {
            method: 'GET',
            url: '/parts/store/:pid/:sid',
            isArray: true
        },
        place: {
            method: 'PUT',
            params: {part_id: '@part_id',store_id: '@store_id',place_id: '@place_id'}, 
            url: '/parts/place'        
        },
        unplace: {
            method: 'PUT',
            params: {part_id: '@part_id',store_id: '@store_id',place_id: '@place_id'}, 
            url: '/parts/unplace'      
        }
    });
  }]);
  
var storesService = angular.module('storesService', ['ngResource']);

storesService.factory('Stores', ['$resource',
function($resource){
  return $resource('/stores/:id');
}]);
 

var configsService = angular.module('configsService', ['ngResource']);

configsService.factory('Configs', ['$resource',
function($resource){
  return $resource('/configs/:id' ,  {}, {
      get: {method:'GET', params:{id:'id'}, isArray:false}
    });
}]);


var pickListsService = angular.module('pickListsService', ['ngResource']);

pickListsService.factory('PickLists', ['$resource',
function($resource){
  return $resource('/pick_lists/:id');
}]);

