class Gymnast{
	constructor(name, age, gender, level){
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.level = level;
	}

	save(onSave){
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
}

export default Gymnast;