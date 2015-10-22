var express = require('express');
var router = express.Router();


/* GET /parts filters listing. */
router.get('/:filename', function(req, res, next) {
 res.render("partials/" + req.params.filename );
});




module.exports = router;
