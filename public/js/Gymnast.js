class Gymnast {
	constructor(name, age, gender, level) {
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.level = level;
		this.id = null;
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
}



export default Gymnast;