var mongoose = require('mongoose');

var PickListSchema = new mongoose.Schema({
	 name :String,
     description : String,
     parts : [{part_id: String,name:String,colour:String,quantity:Number}]
});

module.exports = mongoose.model('PickList', PickListSchema);