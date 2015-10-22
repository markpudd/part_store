var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var part = require('../models/Part.js');
var store = require('../models/Store.js');




/* GET /parts listing. */
router.get('/', function(req, res, next) {
  var category = req.param('category');
  if(category) {
      part.find({'category' : category},  function (err, parts) {
        if (err) return next(err);
        res.json(parts);
      });
  } else {
      part.find(function (err, parts) {
        if (err) return next(err);
        res.json(parts);
      });
  };
});

/* get store parts
db.parts.find({"sub_parts.location":{place_id:11,store_id:1}}) */
router.get('/store/:pid/:secid', function(req, res, next) {  
  part.find({'sub_parts.location' : {'place_id':Number(req.params.pid),'store_id':new mongoose.Types.ObjectId(req.params.secid)}},  function (err, parts) {  
    if (err) return next(err);
    res.json(parts);
  });
});


/* GET /parts filters listing. */
router.get('/:id', function(req, res, next) {  
  part.findOne({'_id' : req.params.id},  function (err, parts) {
    if (err) return next(err);
    res.json(parts);
  });
});


/* PUT '/parts/place' 
*
*  This is a bit of a train wreck from a transactional point of view
*  All this interaction should be pushed to DAO so we can manage properly, however MEAN seems to lead to this type of thing.....
*/
router.put('/place', function(req, res, next) {
   partId=req.body.part_id;
  storeId=req.body.store_id;
  placeId=req.body.place_id;

  part.findByIdAndUpdate({'_id' : partId}, {$set:{'sub_parts.0.location':{'store_id':new mongoose.Types.ObjectId(storeId),'place_id':placeId}}} , function (err, post) {
    console.log(post)
    if (err) return next(err);
  });
  //  This part is really problematic
  //  We need to find if the place_id exist in the hash, if not then create the array
  //  Once the array is created we can push the new part in.
  //  This is a minimum to 2 db interactions (which makes out transact poroblem worse, we could pre-populate the stored map with empty arrays...)
  store.findOne( {'_id' : storeId},  function (err, stores) {
      console.log(stores)
    if (err) return next(err);
    if(!stores.stored)
         stores.stored = {};
     if(!stores.stored[placeId])
         stores.stored[placeId] = [];
     stores.stored[placeId].push(partId); 
     stores.markModified('stores.stored');
     
     // Save doesn't seem to work if there is dynamic schema so lets just update
     store.findByIdAndUpdate( {'_id' : storeId}, stores, function (err, post) {
       if (err) return next(err);
     }); 
  });
  res.json({'ok':1});
});

/* PUT '/parts/unplace' 
*
*  As above this is a bit of a train wreck from a transactional point of view
*  It is likely that all of the node stuff will move Java
*/
router.put('/unplace', function(req, res, next) {
  partId=req.body.part_id;
  storeId=req.body.store_id;
  placeId=req.body.place_id;

  part.findByIdAndUpdate({'_id' : partId}, {$unset:{'sub_parts.0.location':{}}} , function (err, post) {
    if (err) return next(err);
  });
  // This is slightly better the the place as we should be able to remove the item in one step from
  // from the store
  var placePath = 'stored.'+placeId.toString();
  console.log('post')
  console.log(placePath)
  
  console.log(partId)
  console.log('post')
  var pjson = {$pull:{}}
  pjson['$pull'][placePath] = partId;      
  store.findByIdAndUpdate( {'_id' : storeId}, pjson, function (err, post) {
      console.log(post)
    if (err) return next(err);
  });
  res.json({'ok':1});
});



/* PUT /Part/:id */
router.put('/:id', function(req, res, next) {
  part.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* POST /Parts */
router.post('/', function(req, res, next) {

    var jsonSave =  req.body;
    if(jsonSave['_id']) {
        part.findByIdAndUpdate(jsonSave['_id'], req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });  
    } else {
    jsonSave['_id'] =mongoose.Types.ObjectId();
        new part( jsonSave).save(function(err, comment) {
            console.log(err);
          });
    }
});
module.exports = router;
