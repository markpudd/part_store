var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var picklist = require('../models/PickList.js');

/* GET /pick_list listing. */
router.get('/', function(req, res, next) {
  picklist.find(function (err, picklists) {
    if (err) return next(err);
    res.json(picklists);
  });
});

/* GET /pick_list filters listing. */
router.get('/:id', function(req, res, next) {  
  picklist.findOne({'_id' : req.params.id},  function (err, picklists) {
    if (err) return next(err);
    res.json(picklists);
  });
});


/* POST /picklist/*/
router.post('/', function(req, res, next) {
  var jsonSave =  req.body;
  jsonSave['_id'] =mongoose.Types.ObjectId();
  new picklist( jsonSave).save(function(err, comment) {
      console.log(err);
    });
});
module.exports = router;
