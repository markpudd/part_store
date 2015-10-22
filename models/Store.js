var mongoose = require('mongoose');

var StoreSchema = new mongoose.Schema({
	 name :String,
     type : mongoose.Schema.Types.ObjectId,
     image : Number,
     stored :  { }
}, { strict: false });

module.exports = mongoose.model('Store', StoreSchema);