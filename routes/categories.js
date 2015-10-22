var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var part = require('../models/Part.js');

/* GET /catagories listing. */
router.get('/', function(req, res, next) {
  part.distinct('category', function (err, categories) {
    if (err) return next(err);
    res.json(categories);
  });
});



module.exports = router;
