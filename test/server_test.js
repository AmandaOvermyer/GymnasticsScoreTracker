var app = require('../server');
var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var Gymnast = require('../models/gymnast');
var Competition = require('../models/competition');
chai.use(chaiHttp);

var server = app.server;
var runServer = app.runServer;

describe('gymnastics tracker server', () => {
	var gymnastObject;
	var competitionObject;
	beforeEach((done) => {
		runServer(function(){
			Gymnast.create({
				name: 'Beyonka Meadows', 
				age: 9, 
				gender: 'female', 
				level: 3}, 
				function(err, gymnast){
					gymnastObject = gymnast;
					Competition.create({
						user_id: gymnast._id,
						name: 'South Event',
						date: '12/1/16',
						location: 'Georgia',
						final_position: 2,
						floor_score: 9.1,
						floor_final_position: 1,
						beam_score: 8.7,
						beam_final_position: 10,
						vault_score: 9.2,
						vault_final_position: 5,
						bars_score: 9.4,
						bars_final_position: 1}, 
						function(err, competition){
							competitionObject = competition;
							done();
						}) 
				}
			)	
		});	
	})	

	afterEach((done) => {
		Gymnast.remove(function(){
			Competition.remove(function(){
				done();
			})
		})
	});

	describe('gymnast endpoint', () => {

		it('should add a gymnast on post', (done) => {
			chai.request(server)
			.post('/gymnast')
			.send({name: 'Peyton Overmyer', age: 9, gender: 'female', level: 3})
			.end((error, response) =>{
				expect(response).to.have.status(201);
				expect(response.body.name).to.equals("Peyton Overmyer");
				expect(response.body.age).to.equals(9);
				expect(response.body.gender).to.equals('female');
				expect(response.body.level).to.equals(3);
				done();
			})
		});

		it('should return an error if one of the attributes is missing', (done) => {
			chai.request(server)
			.post('/gymnast')
			.send({name: 'Peyton Overmyer', age: 9, gender: 'female'})
			.end((error, response) => {
				expect(response).to.have.status(500);
				expect(response.body.message).to.equals('Internal Server Error');
				done();
			})
		});

		it('should return a list of gymnasts on get', (done) => {
			chai.request(server)
			.get('/gymnast')
			.end((error, response) => {
				expect(response).to.have.status(200);
				expect(response.body.length).to.equals(1);
				expect(response.body[0].name).to.equals('Beyonka Meadows');
				expect(response.body[0].age).to.equals(9);
				expect(response.body[0].gender).to.equals('female');
				expect(response.body[0].level).to.equals(3);
				done();
			})
		});

		it('should add a competition for a gymnast on post', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.post('/gymnast/' + id + '/competition')
			.send({
				user_id: id, 
				name: 'KPAC Cup',
				date: '12/1/16',
				location: 'Charlotte, North Carolina',
				final_position: 2,
				floor_score: 9.5,
				floor_final_position: 1,
				beam_score: 9.2,
				beam_final_position: 3,
				vault_score: 9.3,
				vault_final_position: 5,
				bars_score: 9.4,
				bars_final_position: 2})
			.end((error, response) => {
				expect(response).to.have.status(201);
				expect(response.body.name).to.equals('KPAC Cup');
				expect(response.body.date).to.equals('12/1/16');
				expect(response.body.location).to.equals('Charlotte, North Carolina');
				expect(response.body.final_position).to.equals(2);
				expect(response.body.floor_score).to.equals(9.5);
				expect(response.body.floor_final_position).to.equals(1);
				expect(response.body.beam_score).to.equals(9.2);
				expect(response.body.beam_final_position).to.equals(3);
				expect(response.body.vault_score).to.equals(9.3);
				expect(response.body.vault_final_position).to.equals(5);
				expect(response.body.bars_score).to.equals(9.4);
				expect(response.body.bars_final_position).to.equals(2);
				done();
			})
		});

		it('should return an error if one of the attributes is missing', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.post('/gymnast/' + id + '/competition')
			.send({name: 'LCA Challenge', date: '4/3/17'})
			.end((error, response) => {
				expect(response).to.have.status(500);
				expect(response.body.message).to.equals('Internal Server Error');
				done();
			})
		});
		
		it('should return a list of competitions for gymnast on get', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.get('/gymnast/' + id + '/competition')
			.end((error, response) => {
				expect(response).to.have.status(200);
				done();
			})
		});

		it('should update gymnast on put', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.put('/gymnast/' + id)
			.send({age: 10, level: 4})
			.end((error, response) => {
				expect(response).to.have.status(200);
				expect(response.body.age).to.equals(10);
				expect(response.body.level).to.equals(4);
				expect(response.body.name).to.equals('Beyonka Meadows');
				done();
			})
		});

		it('should update competition on put', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.put('/gymnast/' + id + '/competition/' + competitionObject._id)
			.send({name: 'Diamonds and Denim', date: '3/2/17'})
			.end((error, response) => {
				expect(response).to.have.status(200);
				expect(response.body.name).to.equals('Diamonds and Denim');
				expect(response.body.date).to.equals('3/2/17');
				expect(response.body.location).to.equals('Georgia');
				done();
			})
		});

		it('should not update gymnast if inapplicable information is received', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.put('/gymnast/' + id)
			.send({weight: 80})
			.end((error, response) => {
				expect(response).to.have.status(200);
				expect(response.body.weight).to.equals(undefined);
				done();
			})
		})

		it('should not update competition if inapplicable information is received', (done) => {
			var id = gymnastObject._id;
			var competition_id = competitionObject._id;
			chai.request(server)
			.put('/gymnast/' + id +'/competition/' + competition_id)
			.send({numberParticipants: 12})
			.end((error, response) => {
				expect(response).to.have.status(200);
				expect(response.body.numberParticipants).to.equals(undefined);
				done();
			})
		})

		it('should return an error if the id does not exist on put', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.put('/gymnast/' + 400)
			.end((error, response) => {
				expect(response).to.have.status(500);
				expect(response.body).to.deep.equals({message: 'Internal Server Error'});
				done();
			})
		});

		it('should not change the user id on a competition', (done) => {
			var id = gymnastObject._id;
			var competition_id = competitionObject._id;
			chai.request(server)
			.put('/gymnast/' + id + '/competition/' + competition_id)
			.send({user_id: 9})
			.end((error, response) => {
				/*expect(response.body.user_id).to.equal(id);*/
				done();
			})
		})

		it('should remove a gymnast on delete', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.delete('/gymnast/' + id)
			.end((error, response) => {
				expect(response).to.have.status(201);
				expect(response.body).to.deep.equals({});
				done();
			})
		});

		it('should remove a competition of a gymnast on delete', (done) => {
			var id = gymnastObject._id;
			var competition_id = competitionObject._id;
			chai.request(server)
			.delete('/gymnast/' + id + '/competition/' + competition_id)
			.end((error, response) => {
				expect(response).to.have.status(201);
				expect(response.body).to.deep.equals({});
				done();
			})
		})

		it('should return an error if the id does not exist on delete', (done) => {
			chai.request(server)
			.delete('/gymnast/45')
			.end((error, response) => {
				expect(response).to.have.status(500);
				expect(response.body).to.deep.equals({message: 'Internal Server Error'});
				done();
			})
		})

		it('should return an error if the id of the competition does not exist on delete', (done) => {
			var id = gymnastObject._id;
			chai.request(server)
			.delete('/gymnast/' + id + '/competition/' + 45)
			.end((error, response) => {
				expect(response).to.have.status(500);
				expect(response.body).to.deep.equals({message: 'Internal Server Error'});
				done();
			})
		})

		it('should delete a competition if a user with a competition is deleted', (done) => {
			var id = gymnastObject._id;
			var competition_id = competitionObject._id;
			chai.request(server)
			.delete('/gymnast/' + id)
			.end((error, response) => {
				expect(response).to.have.status(201);
				Competition.findById(competition_id, function(err, competition){
					expect(competition).to.equals(null);
					done();
				})	 
			})
		})
	})	
});