var mongoose = require('mongoose');

var GymnastSchema = new mongoose.Schema({
	name: {type: String, required: true},
	age: {type: Number, required: true},
	gender: {type: String, required: true},
	level: {type: Number, required: true}
	});

var Gymnast = mongoose.model('Gymnast', GymnastSchema);


module.exports = Gymnast;