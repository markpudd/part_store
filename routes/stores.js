var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var store = require('../models/Store.js');


/* GET /stores listing. */
router.get('/', function(req, res, next) {
  store.find(function (err, stores) {
    if (err) return next(err);
    res.json(stores);
  }).sort('_id');
});

/* GET /stores filters listing. */
router.get('/:id', function(req, res, next) {  
  store.findOne({'_id' : req.params.id},  function (err, stores) {
     console.log(stores)
    if (err) return next(err);
    res.json(stores);
  });
});

/* PUT /stores/:id */
router.put('/:id', function(req, res, next) {
  store.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(store);
  });
});

/* POST /stores/:id */
router.post('/', function(req, res, next) {
    var jsonSave =  req.body;
    if(jsonSave['_id']) {
        store.findByIdAndUpdate(jsonSave['_id'], req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });  
    } else {
    jsonSave['_id'] =mongoose.Types.ObjectId();
        new store( jsonSave).save(function(err, comment) {
            console.log(err);
          });
    }
});

module.exports = router;
