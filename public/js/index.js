import Gymnast from "./Gymnast";
import Competition from "./competition";

var gymnastCollection = [];
$(".gymnasts").submit((e) => {
	e.preventDefault();
	const name = $(".nameinput").val().trim();
	const age = $(".ageinput").val().trim();
	const gender = $(".genderlist").val();
	const level = $(".levellist").val();
	
	if (name == "" || age == "" || gender == "" || level == ""){
		alert ("There is information missing")
	} else {
		const gymnast = new Gymnast(name, age, gender, level);
		gymnast.save(onGymnastSave);
		$(".nameinput").val("").focus();
		$(".ageinput").val("");
		$(".genderlist").val("");
		$(".levellist").val("");
	}
	
	


});

function onGymnastSave(data) {
	const gymnastList = $('.gymnast-list');
	var i = gymnastCollection.length;
	var gymnast = new Gymnast(data.name, data.age, data.gender, data.level);
	gymnast.setId(data._id);
	gymnastCollection.push(gymnast);
	gymnastList.append(addGymnast(i, data));

}

function fetchGymnast() {
	const gymnastList = $('.gymnast-list');
	$.ajax('/gymnast', {
		type: 'GET',
		contentType: 'application/json',
	}).done(function(gymnastArray) {
		for (var i = 0; i < gymnastArray.length; i++) {
			const data = gymnastArray[i];
			var gymnast = new Gymnast(data.name, data.age, data.gender, data.level);
			gymnast.setId(data._id);
			gymnastCollection.push(gymnast);
			gymnastList.append(addGymnast(i, data));
		}
	});
}

function addGymnast(i, data) {
	console.log(i);
	var gymnastTemplate = $('.templates > .gymnast').clone();
	gymnastTemplate.find('.name').text(data.name);
	gymnastTemplate.find('.age').text("age: " + data.age);
	gymnastTemplate.find('.gender').text(data.gender);
	gymnastTemplate.find('.level').text("level: " + data.level);
	gymnastTemplate.attr("data-position", i);
	return gymnastTemplate;
}

function replaceGymnast(data) {
	var gymnastTemplate = $('.templates > .gymnast > .gymnast-data').clone();
	gymnastTemplate.find('.name').text(data.name);
	gymnastTemplate.find('.age').text("age: " + data.age);
	gymnastTemplate.find('.gender').text(data.gender);
	gymnastTemplate.find('.level').text("level: " + data.level);
	return gymnastTemplate;
}

function addCompetition(data) {
	var competitionTemplate = $('.templates > .competition').clone();
	return competitionData(competitionTemplate, data);
}	
	
function competitionData(competitionTemplate, data){
	competitionTemplate.find('.userId').text(data.userId);
	competitionTemplate.find('.name').text(data.name);
	competitionTemplate.find('.date').text(data.date);
	competitionTemplate.find('.location').text("Location: " + data.location);
	competitionTemplate.find('.final_position').text("All Around: " + (data.final_position || 0));
	competitionTemplate.find('.floor_score').text("Floor Score: " + (data.floor_score || 0));
	competitionTemplate.find('.floor_final_position').text("Floor: " + (data.floor_final_position || 0));
	competitionTemplate.find('.beam_score').text("Beam Score: " + (data.beam_score || 0));
	competitionTemplate.find('.beam_final_position').text("Beam: " + (data.beam_final_position || 0));
	competitionTemplate.find('.vault_score').text("Vault Score: " + (data.vault_score || 0));
	competitionTemplate.find('.vault_final_position').text("Vault: " + (data.vault_final_position || 0));
	competitionTemplate.find('.bars_score').text("Bars Score: " + (data.bars_score || 0));
	competitionTemplate.find('.bars_final_position').text("Bars: " + (data.bars_final_position || 0));
	competitionTemplate.attr("data-id", data._id);
	return competitionTemplate;
	
}

function replaceCompetition(data) {
	var competitionTemplate = $('.templates > .competition > .competition-data').clone();
	return competitionData(competitionTemplate, data);
	
}

$('.gymnast-list').on('click', ".add-competition", function() {
	var form = $('.templates > .competitions').clone();
	var position = $(this).parent().attr("data-position");
	var id = gymnastCollection[position].id;
	form.find(".userIdInput").val(id);
	$(this).parent().append(form);
});

$('.gymnast-list').on('click', '.saveCompetition', function(e) {
	e.preventDefault();
	var form = $(this).parent();
	var gymnastEl = form.parent();
	var position = gymnastEl.attr('data-position');
	var gymnast = gymnastCollection[position];
	const competition = competitionFormData(form);
	if (name == "" || date == "" || location == "" ){
		alert ("There is information missing")
	} else {
	gymnast.saveCompetition(competition, function(data) {
			const competitionList = form.parent().find(".competition-list");
			competitionList.append(addCompetition(data));
		}),
		form.hide();
	}
});

function competitionFormData(form) {
	const userId = form.find(".userIdInput").val();
	const name = form.find(".nameinput").val();
	const date = form.find(".dateinput").val();
	const location = form.find(".locationinput").val();
	const finalPosition = form.find(".final_position_input").val();
	const floorScore = form.find(".floor_score_input").val();
	const floorFinalPosition = form.find(".floor_final_position_input").val();
	const beamScore = form.find(".beam_score_input").val();
	const beamFinalPosition = form.find(".beam_final_position_input").val();
	const vaultScore = form.find(".vault_score_input").val();
	const vaultFinalPosition = form.find(".vault_final_position_input").val();
	const barsScore = form.find(".bars_score_input").val();
	const barsFinalPosition = form.find(".bars_final_position_input").val();
	//const competition = new Competition(userId, name, date, location);
	var competition = {
		userId: userId,
		name: name,
		date: date,
		location: location,
		final_position: finalPosition,
		floor_score: floorScore,
		floor_final_position: floorFinalPosition,
		beam_score: beamScore,
		beam_final_position: beamFinalPosition,
		vault_score: vaultScore,
		vault_final_position: vaultFinalPosition,
		bars_score: barsScore,
		bars_final_position: barsFinalPosition
	};
	return competition;
}

$('.gymnast-list').on('click', ".edit-gymnast", function() {
	var gymnastEl = $(this).parent();
	var position = gymnastEl.attr('data-position');
	var gymnast = gymnastCollection[position];
	var form = $('.gymnasts').clone();
	form.removeClass("gymnasts");
	form.find(".nameinput").val(gymnast.name);
	form.find(".ageinput").val(gymnast.age);
	form.find(".genderlist").val(gymnast.gender);
	form.find(".levellist").val(gymnast.level);
	form.find(".addGymnast").text("Save");
	form.find(".addGymnast").click(function(e) {
		e.preventDefault();
		var newData = {
			name: form.find(".nameinput").val(),
			age: form.find(".ageinput").val(),
			gender: form.find(".genderlist").val(),
			level: form.find(".levellist").val(),
		}
		gymnast.update(newData, function(data) {
			var template = replaceGymnast(data);
			gymnastEl.find(".gymnast-data").replaceWith(template);
		})
	})
	gymnastEl.find(".gymnast-data").empty();
	gymnastEl.find(".gymnast-data").append(form);

});

$('.gymnast-list').on('click', ".show-competitions", function() {
	$(".nameinput").val("").focus();
	var gymnastEl = $(this).parent();
	var position = gymnastEl.attr('data-position');
	var gymnast = gymnastCollection[position];
	const competitionList = gymnastEl.find(".competition-list");
	gymnast.getCompetitions(function(data) {
		competitionList.append(addCompetition(data));
	})
});

$('.gymnast-list').on('click', ".delete-button", function() {
	var position = $(this).parent().attr('data-position');
	var gymnast = gymnastCollection[position];
	gymnast.remove(() => {
		$(this).parent().remove();
		console.log(this);
		//gymnastCollection.splice(position, 1);
	})

});

$('.gymnast-list').on('click', ".delete-competition", function() {
	var compEl = $(this).parent();
	var gymnastEl = compEl.parent().parent();
	var position = gymnastEl.attr('data-position');
	var gymnast = gymnastCollection[position];
	var compId = compEl.attr('data-id');
	gymnast.deleteCompetition(compId, () => {
		$(this).parent().remove();
	});
});

$('.gymnast-list').on('click', ".edit-competition", function() {
	var compEl = $(this).parent();
	var gymnastEl = compEl.parent().parent();
	var compId = compEl.attr('data-id');
	var position = gymnastEl.attr('data-position');
	var gymnast = gymnastCollection[position];
	var competition = gymnast.getCompetitionbyId(compId);
	var form = $('.competitions').clone();
	form.removeClass("competitions");
	form.find(".nameinput").val(competition.name);
	form.find(".dateinput").val(competition.date);
	form.find(".locationinput").val(competition.location);
	form.find(".final_position_input").val(competition.final_position);
	form.find(".floor_score_input").val(competition.floor_score);
	form.find(".floor_final_position_input").val(competition.floor_final_position);
	form.find(".beam_score_input").val(competition.beam_score);
	form.find(".beam_final_position_input").val(competition.beam_final_position);
	form.find(".vault_score_input").val(competition.vault_final_position);
	form.find(".vault_final_position_input").val(competition.vault_final_position);
	form.find(".bars_score_input").val(competition.bars_score);
	form.find(".bars_final_position_input").val(competition.bars_final_position);
	
	var competitionButton = form.find(".saveCompetition");
	competitionButton.removeClass("saveCompetition");
	competitionButton.text("Save Competition");
	competitionButton.click(function(e) {
		e.preventDefault();
		var newData = competitionFormData(form);
		gymnast.updateComp(compId, newData, function(data) {
			var template = replaceCompetition(data);
			compEl.find(".competition-data").replaceWith(template);
		})
	})
	
	compEl.find(".competition-data").empty();
	compEl.find(".competition-data").append(form);
	
});

fetchGymnast();