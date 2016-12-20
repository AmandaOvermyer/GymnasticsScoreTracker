class Competition {
	constructor(userId, name, date, location) {
		this.userId = userId;
		this.name = name;
		this.date = date;
		this.location = location;
	}

	save(onSave, otherFields) {
		const payload = {
			userId: this.userId,
			name: this.name,
			date: this.date,
			location: this.location,
		} 
		$.extend(payload, otherFields);
		
		console.log(payload);
		$.ajax('/gymnast/' + this.userId + '/competition', {
			type: 'POST',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json',
		}).done(onSave);
	}

}

export default Competition;
