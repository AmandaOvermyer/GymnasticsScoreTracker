class Gymnast {
	constructor(name, age, gender, level) {
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.level = level;
		this.id = null;
		this.competitions = [];
	}



	save(onSave) {
		const payload = {
			name: this.name,
			age: this.age,
			gender: this.gender,
			level: this.level,
		}
		console.log(payload);
		$.ajax('/gymnast', {
			type: 'POST',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json',
		}).done(onSave);
	}
	update(gymnastObject, onUpdate) {
		$.extend(this, gymnastObject);
		const payload = {
			name: this.name,
			age: this.age,
			gender: this.gender,
			level: this.level,
		}
		$.ajax('/gymnast/' + this.id, {
			type: 'PUT',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json',
		}).done(onUpdate);
	}
	setId(id) {
		this.id = id;
	}
	remove(onRemove) {
		$.ajax('/gymnast/' + this.id, {
			type: 'DELETE',
			dataType: 'json'
		}).done(onRemove);
	}
	getCompetitions(onGet) {
		$.ajax('/gymnast/' + this.id + '/competition', {
			type: 'GET',
			contentType: 'application/json',
		}).done((competitionResult) => {
			this.competitions = [];
			for (var i = 0; i < competitionResult.length; i++) {
				const data = competitionResult[i];
				this.competitions.push(data);
				onGet(data);
			}
			if (competitionResult.length == 0) {
				onGet(false);
			} 
		});
	}
	saveCompetition(data, onSave) {
		$.ajax('/gymnast/' + this.id + '/competition', {
			type: 'POST',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
		}).done((result) => {
			this.competitions.push(result);
			onSave(result);
		});
	}

	deleteCompetition(id, onDelete) {
		$.ajax('/gymnast/' + this.id + '/competition/' + id, {
			type: 'DELETE',
			dataType: 'json'
		}).done(() => {
			onDelete();
			let foundAt = -1;
			for (var i = 0; i < this.competitions.length; i++) {
				const competition = this.competitions[i];
				if (competition._id == id) {
					foundAt = i;
					break;
				}
			}
			if (foundAt !== -1) {
				this.competitions.splice(foundAt, 1)
			}
		});

	}

	updateComp(id, newData, onUpdateComp) {
		$.ajax('/gymnast/' + this.id + '/competition/' + id, {
			type: 'PUT',
			data: JSON.stringify(newData),
			dataType: 'json',
			contentType: 'application/json',
		}).done((data) => {
			var index = this.getCompIndex(id);
			this.competitions[index] = $.extend(this.competitions[index], newData);
			onUpdateComp(data);
		});
	}

	getCompetitionbyId(id) {
		for (var i = 0; i < this.competitions.length; i++) {
			const competition = this.competitions[i];
			if (competition._id == id) {
				return this.competitions[i];
			}
		}
	}
	getCompIndex(id) {
		for (var i = 0; i < this.competitions.length; i++) {
			const competition = this.competitions[i];
			if (competition._id == id) {
				return i;
			}
		}
	}
}




export default Gymnast;