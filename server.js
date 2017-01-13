var express = require('express');
var bodyParser = require('body-parser');
var Gymnast = require('./models/gymnast');
var mongoose = require('mongoose');
var Competition = require('./models/competition');



var jsonParser = bodyParser.json();

var app = express();
app.use(express.static('public'));

app.post('/gymnast', jsonParser, function(request, response){

		Gymnast.create({name:request.body.name, age:request.body.age, gender:request.body.gender, level:request.body.level}, function(err, gymnast){
			if (err){
				return response.status(500).json({
					message: 'Internal Server Error'
				})
			}
			response.status(201).json(gymnast);
		});	
})

app.post('/gymnast/:id/competition', jsonParser, function(request, response) {
		var id = request.params.id;
		Competition.create({
			user_id: id,
			name: request.body.name,
			date: request.body.date,
			location: request.body.location,
			final_position: request.body.final_position,
			floor_score: request.body.floor_score,
			floor_final_position: request.body.floor_final_position,
			beam_score: request.body.beam_score,
			beam_final_position: request.body.beam_final_position,
			vault_score: request.body.vault_score,
			vault_final_position: request.body.vault_final_position,
			bars_score: request.body.bars_score,
			bars_final_position: request.body.bars_final_position},
			function(err, competition){
				if (err) {
				return response.status(500).json({
					message: 'Internal Server Error'
					})
				}
				response.status(201).json(competition);
			});
})


app.get('/gymnast', function(request, response){
	Gymnast.find(function(err, gymnasts){
		if (err){
			return response.status(500).json({
				message: 'Internal Server Error'
			});
		}
		response.json(gymnasts);
	})
})

app.get('/gymnast/:id/competition', function(request, response){
	var id = request.params.id;
	
	Competition.find({
		user_id: id
	},function(err, competitions){
		if (err){
			console.log(err);
			return response.status(500).json({
				message: 'Internal Server Error'
			});
		}
		response.json(competitions);
	})
})

app.put('/gymnast/:id', jsonParser, function(request, response) {
	var gymnastId = request.params.id;

	Gymnast.findByIdAndUpdate(gymnastId, request.body, {new:true}, function(err, newgymnast){
		if (err){
			return response.status(500).json({
				message: 'Internal Server Error'
			})
		}
		response.status(200).json(newgymnast);
	})
})

app.put('/gymnast/:id/competition/:competition_id', jsonParser, function(request, response) {
	var id = request.params.id;
	delete request.body.user_id;

	Competition.findByIdAndUpdate(request.params.competition_id, request.body, {new:true}, function(err, newcompetition){
		if (err){
			return response.status(500).json({
				message: 'Internal Server Error'
			})
		}

		response.status(200).json(newcompetition);
	})	
})

app.delete('/gymnast/:id', jsonParser, function(request, response) {
	Gymnast.findByIdAndRemove(request.params.id, function(err){
		if (err){
			return response.status(500).json({
				message: 'Internal Server Error'
			})
		}
		Competition.remove({user_id:request.params.id}, function(err){
			if (err){
				return response.status(500).json({
					message: 'Internal Server Error'
				})
			}
			response.status(201).json({});
		})
			
	})
})

app.delete('/gymnast/:id/competition/:competition_id', jsonParser, function(request, response) {
	Competition.findByIdAndRemove(request.params.competition_id, function(err) {
		if (err){
			return response.status(500).json({
				message: 'Internal Server Error'
			})
		}
			response.status(201).json({});
	})
})



var runServer = function(callback) {
	var database; 
	if(process.env.NODE_ENV === "production"){
		database = "mongodb://"+process.env.DBUSER+":"+process.env.DBPASSWORD+"@"+process.env.DBURL;
	} else {
		database = "mongodb://localhost/test";
	}
    mongoose.connect(database, function(err){
        if (err && callback) {
            callback(err);
            return;
        }
        app.listen(process.env.PORT, process.env.IP, function(){
            if (callback) {
                callback();
            }
        });
    })
}

if (require.main === module) {
	runServer(function(err){
	    if (err) {
        	console.log(err);
		}
	});
}


exports.server = app;
exports.runServer = runServer;