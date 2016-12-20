import Gymnast from "./Gymnast";
import Competition from "./competition";

var gymnastCollection = [];
$(".gymnasts").submit((e) => {
	e.preventDefault();
	const name = $(".nameinput").val();
	const age = $(".ageinput").val();
	const gender = $(".genderlist").val();
	const level = $(".levellist").val();
	const gymnast = new Gymnast(name, age, gender, level);
	gymnast.save(onGymnastSave);
	$(".nameinput").val("").focus();
	$(".ageinput").val("");
	$(".genderlist").val("");
	$(".levellist").val("");
	

});

function onGymnastSave(data) {
	const gymnastList = $('.gymnast-list');
	var i = gymnastCollection.length;
	gymnastList.append(addGymnast(i, data));


}

function fetchGymnast() {
	$(".nameinput").focus();
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
	var gymnastTemplate = $('.templates > .gymnast').clone();
	gymnastTemplate.find('.name').text(data.name);
	gymnastTemplate.find('.age').text("age: " + data.age);
	gymnastTemplate.find('.gender').text(data.gender);
	gymnastTemplate.find('.level').text("level: " + data.level);
	gymnastTemplate.attr("data-position", i);
	return gymnastTemplate;
}

function addCompetition(data) {
	var competitionTemplate = $('.templates > .competition').clone();
	competitionTemplate.find('.userId').text(data.userId);
	competitionTemplate.find('.name').text(data.name);
	competitionTemplate.find('.date').text(data.date);
	competitionTemplate.find('.location').text("Location: " + data.location);
	competitionTemplate.find('.final_position').text("All Around: " + data.final_position);
	competitionTemplate.find('.floor_score').text("Floor Score: " + data.floor_score);
	competitionTemplate.find('.floor_final_position').text("Floor: " + data.floor_final_position);
	competitionTemplate.find('.beam_score').text("Beam Score: " + data.beam_score);
	competitionTemplate.find('.beam_final_position').text("Beam: " + data.beam_final_position);
	competitionTemplate.find('.vault_score').text("Vault Score: " + data.vault_score);
	competitionTemplate.find('.vault_final_position').text("Vault: " + data.vault_final_position);
	competitionTemplate.find('.bars_score').text("Bars Score: " + data.bars_score);
	competitionTemplate.find('.bars_final_position').text("Bars: " + data.bars_final_position);
	competitionTemplate.attr("data-id", data._id);
	return competitionTemplate;
}

$('.gymnast-list').on('click', ".add-competition", function() {
	$(".nameinput").val("").focus();
	var form = $('.templates > .competitions').clone();
	var id = $(this).parent().attr("data-id");
	form.find(".userIdInput").val(id);
	$(this).parent().append(form);
});

$('.gymnast-list').on('click', '.saveCompetition', function(e){
	e.preventDefault();
	var form = $(this).parent();
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
	const competition = new Competition(userId, name, date, location);
	competition.save(function(data){
		const competitionList = form.parent().find(".competition-list");
		competitionList.append(addCompetition(data));
	}, {
		final_position: finalPosition,
		floor_score: floorScore,
		floor_final_position: floorFinalPosition,
		beam_score: beamScore,
		beam_final_position: beamFinalPosition,
		vault_score: vaultScore,
		vault_final_position: vaultFinalPosition,
		bars_score: barsScore,
		bars_final_position: barsFinalPosition
	});
	form.hide();
});


$('.gymnast-list').on('click', ".edit-gymnast", function(){
	var gymnastEl = $(this).parent();
	var userId = gymnastEl.attr('data-id');
	$.ajax('/gymnast/' + userId, {
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json'
	}).done((editGymnast) => {
		
	
	});
});

$('.gymnast-list').on('click', ".show-competitions", function(){
	$(".nameinput").val("").focus();
	var gymnastEl = $(this).parent();
	var userId = gymnastEl.attr('data-id');
	const competitionList = gymnastEl.find(".competition-list");
	$.ajax('/gymnast/' + userId + '/competition', {
		type: 'GET',
		contentType: 'application/json',
	}).done(function(competitionArray) {
		for (var i = 0; i < competitionArray.length; i++) {
			const data = competitionArray[i];
			competitionList.append(addCompetition(data));
		}
	});
});

$('.gymnast-list').on('click', ".delete-button", function() {
	var position = $(this).parent().attr('data-position');
	var gymnast = gymnastCollection[position];
	gymnast.remove((onRemove) => {
		$(this).parent().remove();
		console.log(this);
		gymnastCollection.splice(position, 1);
	})
	
});

$('.gymnast-list').on('click', ".delete-competition", function(){
	var compEl = $(this).parent();
	var gymnastEl = compEl.parent().parent();
	var userId = gymnastEl.attr('data-id');
	var compId = compEl.attr('data-id');
	$.ajax('/gymnast/' + userId + '/competition/' + compId,{
		type: 'DELETE',
		dataType: 'json'
	}).done(() => {
		$(this).parent().remove();
	});
});

fetchGymnast();