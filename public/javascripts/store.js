'use strict';

var storeControllers = angular.module('store', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/stores.html', {
        templateUrl: 'partials/stores',
        controller: 'StoresController'
    }).when('/store_load.html/:pid', {
        templateUrl: 'partials/store_load',
        controller: 'StoreLoadController'
    }).when('/store_section.html/:pid/:sid', {
        templateUrl: 'partials/store_section',
        controller: 'StoreSectionController'
    }).when('/new_store.html/:pid', {
        templateUrl: 'partials/new_store',
        controller: 'StoreController'            
    }).when('/store_show.html/:pid', {
            templateUrl: 'partials/store_show',
            controller: 'StoreLoadController'
        });
}]);

storeControllers.directive('dragSource', function() {
    return {
    //    ,ondragstart="drag(event,this)",ondragend="dragEnd(event,this)
        
        restrict: 'A',
        link: function(scope, elem, attrs) {
           elem[0].draggable = true;
            
          elem.on('dragstart', function(ev) {
               elem[0].classList.add('drag_taken');
               ev.originalEvent.dataTransfer.effectAllowed = 'move';
               ev.originalEvent.dataTransfer.setData('text', ev.target.id);
            });
          elem.on('dragend', function(eev,obj) {
   
          });
      }
  };
});


storeControllers.directive('dragDestination', function() {
    return {
     //   ondrop="drop(event,this)",ondragover="allowDrop(event)"
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.on('drop', function(ev) {
                ev.preventDefault();
                scope.drop(ev.originalEvent.dataTransfer.getData('text'),elem[0].id);
              });
            elem.on('dragover', function(ev) {
                ev.preventDefault();
                
            });
        }
    };
    
});

storeControllers.controller('StoresController', ['$scope', '$http', 'Stores', function($scope, $http, Stores) {
    $scope.stores = Stores.query();
}]);


partControllers.controller('StoreController', ['$scope', '$http', 'Configs', 'Stores', function($scope, $http, Configs,Stores) {
    $scope.configs = Configs.query();
    $scope.editorEnabled = false;
    $scope.submit_type = 'POST';
    $scope.configSelected = {};
    $scope.store = {}

    $scope.enableEditor = function() {
        $scope.editorEnabled = true;
    };

    $scope.disableEditor = function() {
        $scope.editorEnabled = false;
    };

    $scope.submit = function() {
        $scope.store.type =   $scope.configSelected._id;
        Stores.save($scope.store);
        $scope.disableEditor();
    };
}]);


storeControllers.filter('noLocation', function () {
  return function (items) {
    var filtered = [];
    if(items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (!item['sub_parts'][0]['location']) {
            filtered.push(item);
          }
        }
    } 
    return filtered;
  };
});

storeControllers.controller('StoreSectionController', ['$scope', '$http', '$routeParams','Parts','Stores','Configs', function($scope, $http,$routeParams,Parts,Stores,Configs) {
    $scope.store_config = { };
    $scope.selected_place = 0;
    // Used for the store drop down
    $scope.storeSelected ={};
    // should project this.....
    $scope.store_list = Stores.query();
    
    $scope.store = Stores.get({'id':$routeParams.pid} , function() {
          $scope.store_config = Configs.get({id:$scope.store.type});
          $scope.storeSelected = $scope.store;
    });
    
    $scope.section_parts = Parts.psection({'pid':$routeParams.pid,'sid':$routeParams.sid});
  
    $scope.storeChanged = function() {
        // reload to help prevent clash issues

        $scope.store = Stores.get({'id':$scope.storeSelected._id} , function() {
              $scope.store_config = Configs.get({id:$scope.store.type});
        });
        $scope.selected_place = 0;
        
     }
  
    $scope.selectPlace = function(sid) {
        $scope.selected_place = sid;
        $scope.section_parts = Parts.psection({'sid':$scope.store._id,'pid':Number(sid)});
    }
    
    /* As with the drop function there is 2 options here
    /  Option 1 - Manage updating the model on the client if the server suceeds
    /  Option 2 - Or get the updated models from the server
    /  
    /  --  Option 1 --  We could do 2 $save but this would limit transactional nature (both updates should be in single transaction). 
    */
    
    $scope.remove = function(partId) {
        //  find destId (could also do this server side which would be slightly better)
        var destId;
         var indexToRemove =-1;
         for (var i = 0; i < $scope.section_parts.length; i++) {
             if ($scope.section_parts[i]['_id'] == partId) {          
                 // theis removes location from part
                 destId =$scope.section_parts[i]['sub_parts'][0]['location']['place_id'];
                 indexToRemove = i;
             }
         }
        Parts.unplace({'part_id':partId,'store_id':$scope.storeSelected['_id'],'place_id':destId} , function() {
            // remove from local array
            if (indexToRemove > -1) {   
                $scope.section_parts.splice(indexToRemove, 1);
            }
            // remove part from drawer
            destId = destId.toString();
            var index = $scope.store['stored'][destId].indexOf(partId);
            if (index > -1) {
                $scope.store['stored'][destId].splice(index, 1);
            }  
        }); 
    }
    
}]);

storeControllers.controller('StoreLoadController', ['$scope', '$http', '$routeParams','Parts','Stores','Configs', function($scope, $http,$routeParams,Parts,Stores,Configs) {

    $scope.storeSelected ={};
    $scope.categorySelected='';
    $scope.store_config = { };


    // should project this.....
    $scope.store_list = Stores.query();
    
    
    
    $scope.store = Stores.get({'id':$routeParams.pid} , function() {
        console.log($scope.store)
          $scope.store_config = Configs.get({id:$scope.store.type})
          $scope.storeSelected = $scope.store;
    }); 

    $scope.categories =  Parts.categories( function() {
          $scope.categorySelected = $scope.categories[0];
          $scope.parts = Parts.query({category:$scope.categorySelected});
    });
    $scope.partPage = function(page) {
        
    }
    
   
    $scope.previousPart = function() {
        
    } 
    
    $scope.nextPart = function() {
        
    }
    $scope.storeChanged = function() {
        // reload to help prevent clash issues
        $scope.store = Stores.get({'id':$scope.storeSelected._id} , function() {
              $scope.store_config = Configs.get({id:$scope.store.type});
        });
     }
     
    $scope.categoryChanged = function() {
        $scope.parts = Parts.query({category:$scope.categorySelected});
    }
    
    $scope.drop = function(partId,destId) {
        /* There is 2 options here
        /  Option 1 - Manage updating the model on the client if the server suceeds
        /  Option 2 - Or get the updated models from the server
        /  
        /  --  Option 1 --  We could do 2 $save but this would limit transactional nature (both updates should be in single transaction)
        /*/
        
        // Update server 
        console.log('partId')
        
        console.log(partId)
            console.log('partId')
        
        Parts.place({'part_id':partId,'store_id':$scope.storeSelected['_id'],'place_id':destId} , function() {
            //  Add location to parts
            for (var i = 0; i < $scope.parts.length; i++) {
                if ($scope.parts[i]['_id'] == partId) {          
                    var loc =  { 'store_id':$scope.storeSelected['_id'],'place_id':destId};
                    $scope.parts[i]['sub_parts'][0]['location'] = loc;
                }
            }
            // Add part to drawer
            if(!$scope.store['stored'])
                $scope.store['stored'] = {};
            if(!$scope.store['stored'][destId])
               $scope.store['stored'][destId] = [];
            $scope.store['stored'][destId].push(partId);  
           }); 

    }
        // Option 2 (would have to add category for parts filter)
     //   var rval = Parts.place({'part_id':partId,'store_id':Number($scope.store_config['_id']),'section_id':destId});
      //  $scope.store = rval['store'];
    //    $scope.parts = rval['parts'];
    
    
}]);
