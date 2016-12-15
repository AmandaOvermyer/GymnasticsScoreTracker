import Gymnast from "./Gymnast";


$(".gymnasts").submit((e) => {
	e.preventDefault();
	const name = $(".nameinput").val();
	const age = $(".ageinput").val();
	const gender = $(".genderlist").val();
	const level = $(".levellist").val();
	const gymnast = new Gymnast(name, age, gender, level);
	gymnast.save(onGymnastSave);
	
})

function onGymnastSave(data) {
	const gymnastList = $('.gymnast-list');
	gymnastList.append(addGymnast(data));
	

}

function fetchGymnast() {
	const gymnastList = $('.gymnast-list');
	$.ajax('/gymnast', {
		type: 'GET',
		contentType: 'application/json',
	}).done(function(gymnastArray){
		for (var i=0; i<gymnastArray.length; i++){
			const data = gymnastArray[i];
			gymnastList.append(addGymnast(data));
		}
	});
}

function addGymnast(data) {
	var gymnastTemplate = $('.templates > .gymnast').clone();
	gymnastTemplate.find('.name').text(data.name);
	gymnastTemplate.find('.age').text(data.age);
	gymnastTemplate.find('.gender').text(data.gender);
	gymnastTemplate.find('.level').text(data.level);
	gymnastTemplate.find('.delete-button').attr("data-id", data._id);
	return gymnastTemplate;
}

$('.gymnast-list').on('click', ".delete-button", function(){
	var id = $(this).attr('data-id');
	console.log("hello");

	$.ajax('/gymnast/' + id, {
		type: 'DELETE',
		dataType: 'json'
	}).done(function(removeGymnast){
		$(this).parent().remove();


	})
})

fetchGymnast();
