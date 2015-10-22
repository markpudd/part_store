var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema([{sid:String,css:String}]);

var ConfigSchema = new mongoose.Schema({
	 name :String,
     rows : [ FieldSchema ]
});

module.exports = mongoose.model('Config', ConfigSchema);