var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../models/Config.js');

/* GET /configs listing. */
router.get('/', function(req, res, next) {
  config.find(function (err, configs) {
    if (err) return next(err);
    res.json(configs);
  });
});

/* GET /configs filters listing. */
router.get('/:id', function(req, res, next) {  
  config.findOne({'_id' : req.params.id},  function (err, configs) {
    if (err) return next(err);
    res.json(configs);
  });
});

/* PUT /configs/:id */
router.put('/:id', function(req, res, next) {
  config.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST /configs/:id */
router.post('/', function(req, res, next) {
  var jsonSave =  req.body;
  jsonSave['_id'] =mongoose.Types.ObjectId();
  new config( jsonSave).save(function(err, comment) {
      console.log(err);
    });
});

module.exports = router;
