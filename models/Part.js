var mongoose = require('mongoose');

var PartSchema = new mongoose.Schema({
	 _id :String,
	 description :String,
     category : String,
     image : String,
     sub_parts : [ {quantity :Number, colour :String, location : {store_id: mongoose.Schema.Types.ObjectId,place_id:Number}}]
});

module.exports = mongoose.model('Part', PartSchema);