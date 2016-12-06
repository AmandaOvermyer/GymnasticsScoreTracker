var mongoose = require('mongoose');

var CompetitionSchema = new mongoose.Schema({
	user_id: {type: String, required: true},
	name: {type: String, required: true},
	date: {type: String, required: true},
	location: {type: String, required: true},
	final_position: {type: Number},
	floor_score: {type: Number},
	floor_final_position: {type: Number},
	beam_score: {type: Number},
	beam_final_position: {type: Number},
	vault_score: {type: Number},
	vault_final_position: {type: Number},
	bars_score: {type: Number},
	bars_final_position: {type: Number}
	});

var Competition = mongoose.model('Competition', CompetitionSchema);


module.exports = Competition;