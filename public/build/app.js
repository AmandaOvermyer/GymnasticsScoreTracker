/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Gymnast = __webpack_require__(1);

	var _Gymnast2 = _interopRequireDefault(_Gymnast);

	var _competition = __webpack_require__(2);

	var _competition2 = _interopRequireDefault(_competition);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gymnastCollection = [];
	$(".js-create-gymnast").submit(function (e) {
		e.preventDefault();
		var name = $(".nameinput").val().trim();
		var age = $(".ageinput").val().trim();
		var gender = $(".genderlist").val();
		var level = $(".levellist").val();

		if (name == "" || age == "" || gender == "" || level == "") {
			alert("There is information missing");
		} else {
			var gymnast = new _Gymnast2.default(name, age, gender, level);
			gymnast.save(onGymnastSave);
			$(".nameinput").val("").focus();
			$(".ageinput").val("");
			$(".genderlist").val("");
			$(".levellist").val("");
		}
	});

	function onGymnastSave(data) {
		var gymnastList = $('.gymnast-list');
		var i = gymnastCollection.length;
		var gymnast = new _Gymnast2.default(data.name, data.age, data.gender, data.level);
		gymnast.setId(data._id);
		gymnastCollection.push(gymnast);
		gymnastList.append(addGymnast(i, data));
	}

	function fetchGymnast() {
		var gymnastList = $('.gymnast-list');
		$.ajax('/gymnast', {
			type: 'GET',
			contentType: 'application/json'
		}).done(function (gymnastArray) {
			for (var i = 0; i < gymnastArray.length; i++) {
				var data = gymnastArray[i];
				var gymnast = new _Gymnast2.default(data.name, data.age, data.gender, data.level);
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
		gymnastTemplate.find('.age').text(data.age);
		gymnastTemplate.find('.gender').text(data.gender);
		gymnastTemplate.find('.level').text("level: " + data.level);
		gymnastTemplate.find('.gymnast-content').attr("data-position", i);
		return gymnastTemplate;
	}

	function replaceGymnast(data) {
		var gymnastTemplate = $('.templates > .gymnast >.gymnast-content > .gymnast-data').clone();
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

	function competitionData(competitionTemplate, data) {
		competitionTemplate.find('.userId').text(data.userId);
		competitionTemplate.find('.name').text(data.name);
		competitionTemplate.find('.date').text(data.date);
		competitionTemplate.find('.location').text(data.location);
		competitionTemplate.find('.final_position').text(data.final_position || 0);
		competitionTemplate.find('.floor_score').text(data.floor_score || 0);
		competitionTemplate.find('.floor_final_position').text(data.floor_final_position || 0);
		competitionTemplate.find('.beam_score').text(data.beam_score || 0);
		competitionTemplate.find('.beam_final_position').text(data.beam_final_position || 0);
		competitionTemplate.find('.vault_score').text(data.vault_score || 0);
		competitionTemplate.find('.vault_final_position').text(data.vault_final_position || 0);
		competitionTemplate.find('.bars_score').text(data.bars_score || 0);
		competitionTemplate.find('.bars_final_position').text(data.bars_final_position || 0);
		competitionTemplate.attr("data-id", data._id);
		return competitionTemplate;
	}

	function replaceCompetition(data) {
		var competitionTemplate = $('.templates > .competition > .competition-data').clone();
		return competitionData(competitionTemplate, data);
	}

	$('.gymnast-list').on('click', ".add-competition", function () {
		var form = $('.templates > .js-create-competition').clone();
		var position = $(this).parent().attr("data-position");
		var id = gymnastCollection[position].id;
		form.find(".userIdInput").val(id);
		$(this).parent().find(".competition-list").empty();
		$(this).parent().append(form);
	});

	$('.gymnast-list').on('click', '.saveCompetition', function (e) {
		e.preventDefault();
		var form = $(this).parent();
		var gymnastEl = form.parent();
		var position = gymnastEl.attr('data-position');
		var gymnast = gymnastCollection[position];
		var competition = competitionFormData(form);
		if (competition.name == "" || competition.date == "" || competition.location == "") {
			alert("There is information missing");
		} else {
			gymnast.saveCompetition(competition, function (data) {
				var competitionList = form.parent().find(".competition-list");
				competitionList.append(addCompetition(data));
				form.hide();
			});
		}
	});

	function competitionFormData(form) {
		console.log(form.find(".final_position_input"));
		var userId = form.find(".userIdInput").val();
		var name = form.find(".nameinput").val();
		var date = form.find(".dateinput").val();
		var location = form.find(".locationinput").val();
		var finalPosition = form.find(".final_position_input").val();
		var floorScore = form.find(".floor_score_input").val();
		var floorFinalPosition = form.find(".floor_final_position_input").val();
		var beamScore = form.find(".beam_score_input").val();
		var beamFinalPosition = form.find(".beam_final_position_input").val();
		var vaultScore = form.find(".vault_score_input").val();
		var vaultFinalPosition = form.find(".vault_final_position_input").val();
		var barsScore = form.find(".bars_score_input").val();
		var barsFinalPosition = form.find(".bars_final_position_input").val();
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
		console.log(competition);
		return competition;
	}

	$('.gymnast-list').on('click', ".edit-gymnast", function () {
		var gymnastEl = $(this).parent().parent();
		var position = gymnastEl.attr('data-position');
		var gymnast = gymnastCollection[position];
		var form = $('.js-create-gymnast').clone();
		form.removeClass("js-create-gymnast");
		form.find(".nameinput").val(gymnast.name);
		form.find(".ageinput").val(gymnast.age);
		form.find(".genderlist").val(gymnast.gender);
		form.find(".levellist").val(gymnast.level);
		form.find(".addGymnast").text("Save");
		form.find(".addGymnast").click(function (e) {
			e.preventDefault();
			var newData = {
				name: form.find(".nameinput").val(),
				age: form.find(".ageinput").val(),
				gender: form.find(".genderlist").val(),
				level: form.find(".levellist").val()
			};
			gymnast.update(newData, function (data) {
				var template = replaceGymnast(data);
				gymnastEl.find(".gymnast-data").replaceWith(template);
			});
		});
		gymnastEl.find(".gymnast-data").empty();
		gymnastEl.find(".gymnast-data").append(form);
	});

	$('.gymnast-list').on('click', ".show-competitions", function () {
		var gymnastEl = $(this).parent();
		var position = gymnastEl.attr('data-position');
		var gymnast = gymnastCollection[position];
		var competitionList = gymnastEl.find(".competition-list");
		competitionList.empty();
		gymnastEl.find('.js-create-competition').remove();
		gymnast.getCompetitions(function (data) {
			if (!data) {
				alert("There are no competitions entered yet");
			} else {
				competitionList.append(addCompetition(data));
			}
		});
	});

	$('.gymnast-list').on('click', ".delete-button", function () {
		var _this = this;

		var position = $(this).parent().parent().attr('data-position');
		var gymnast = gymnastCollection[position];
		gymnast.remove(function () {
			$(_this).parent().parent().remove();
			console.log(_this);
			//gymnastCollection.splice(position, 1);
		});
	});

	$('.gymnast-list').on('click', ".delete-competition", function () {
		var _this2 = this;

		var compEl = $(this).parent();
		var gymnastEl = compEl.parent().parent();
		var position = gymnastEl.attr('data-position');
		var gymnast = gymnastCollection[position];
		var compId = compEl.attr('data-id');
		gymnast.deleteCompetition(compId, function () {
			$(_this2).parent().remove();
		});
	});

	$('.gymnast-list').on('click', ".edit-competition", function () {
		var compEl = $(this).parent();
		var gymnastEl = compEl.parent().parent();
		var compId = compEl.attr('data-id');
		var position = gymnastEl.attr('data-position');
		var gymnast = gymnastCollection[position];
		var competition = gymnast.getCompetitionbyId(compId);
		var form = $('.js-create-competition').clone();
		form.removeClass("js-create-competition");
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
		competitionButton.click(function (e) {
			e.preventDefault();
			var newData = competitionFormData(form);
			gymnast.updateComp(compId, newData, function (data) {
				var template = replaceCompetition(data);
				compEl.find(".competition-data").replaceWith(template);
			});
		});

		compEl.find(".competition-data").empty();
		compEl.find(".competition-data").append(form);
	});

	$('.start-tracker').on('click', function () {
		$(".splash-screen").hide();
		$(".gymnasts").show();
		fetchGymnast();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Gymnast = function () {
		function Gymnast(name, age, gender, level) {
			_classCallCheck(this, Gymnast);

			this.name = name;
			this.age = age;
			this.gender = gender;
			this.level = level;
			this.id = null;
			this.competitions = [];
		}

		_createClass(Gymnast, [{
			key: 'save',
			value: function save(onSave) {
				var payload = {
					name: this.name,
					age: this.age,
					gender: this.gender,
					level: this.level
				};
				console.log(payload);
				$.ajax('/gymnast', {
					type: 'POST',
					data: JSON.stringify(payload),
					dataType: 'json',
					contentType: 'application/json'
				}).done(onSave);
			}
		}, {
			key: 'update',
			value: function update(gymnastObject, onUpdate) {
				$.extend(this, gymnastObject);
				var payload = {
					name: this.name,
					age: this.age,
					gender: this.gender,
					level: this.level
				};
				$.ajax('/gymnast/' + this.id, {
					type: 'PUT',
					data: JSON.stringify(payload),
					dataType: 'json',
					contentType: 'application/json'
				}).done(onUpdate);
			}
		}, {
			key: 'setId',
			value: function setId(id) {
				this.id = id;
			}
		}, {
			key: 'remove',
			value: function remove(onRemove) {
				$.ajax('/gymnast/' + this.id, {
					type: 'DELETE',
					dataType: 'json'
				}).done(onRemove);
			}
		}, {
			key: 'getCompetitions',
			value: function getCompetitions(onGet) {
				var _this = this;

				$.ajax('/gymnast/' + this.id + '/competition', {
					type: 'GET',
					contentType: 'application/json'
				}).done(function (competitionResult) {
					_this.competitions = [];
					for (var i = 0; i < competitionResult.length; i++) {
						var data = competitionResult[i];
						_this.competitions.push(data);
						onGet(data);
					}
					if (competitionResult.length == 0) {
						onGet(false);
					}
				});
			}
		}, {
			key: 'saveCompetition',
			value: function saveCompetition(data, onSave) {
				var _this2 = this;

				$.ajax('/gymnast/' + this.id + '/competition', {
					type: 'POST',
					data: JSON.stringify(data),
					dataType: 'json',
					contentType: 'application/json'
				}).done(function (result) {
					_this2.competitions.push(result);
					onSave(result);
				});
			}
		}, {
			key: 'deleteCompetition',
			value: function deleteCompetition(id, onDelete) {
				var _this3 = this;

				$.ajax('/gymnast/' + this.id + '/competition/' + id, {
					type: 'DELETE',
					dataType: 'json'
				}).done(function () {
					onDelete();
					var foundAt = -1;
					for (var i = 0; i < _this3.competitions.length; i++) {
						var competition = _this3.competitions[i];
						if (competition._id == id) {
							foundAt = i;
							break;
						}
					}
					if (foundAt !== -1) {
						_this3.competitions.splice(foundAt, 1);
					}
				});
			}
		}, {
			key: 'updateComp',
			value: function updateComp(id, newData, onUpdateComp) {
				var _this4 = this;

				$.ajax('/gymnast/' + this.id + '/competition/' + id, {
					type: 'PUT',
					data: JSON.stringify(newData),
					dataType: 'json',
					contentType: 'application/json'
				}).done(function (data) {
					var index = _this4.getCompIndex(id);
					_this4.competitions[index] = $.extend(_this4.competitions[index], newData);
					onUpdateComp(data);
				});
			}
		}, {
			key: 'getCompetitionbyId',
			value: function getCompetitionbyId(id) {
				for (var i = 0; i < this.competitions.length; i++) {
					var competition = this.competitions[i];
					if (competition._id == id) {
						return this.competitions[i];
					}
				}
			}
		}, {
			key: 'getCompIndex',
			value: function getCompIndex(id) {
				for (var i = 0; i < this.competitions.length; i++) {
					var competition = this.competitions[i];
					if (competition._id == id) {
						return i;
					}
				}
			}
		}]);

		return Gymnast;
	}();

	exports.default = Gymnast;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Competition = function () {
		function Competition(userId, name, date, location) {
			_classCallCheck(this, Competition);

			this.userId = userId;
			this.name = name;
			this.date = date;
			this.location = location;
		}

		_createClass(Competition, [{
			key: "save",
			value: function save(onSave, otherFields) {
				var payload = {
					userId: this.userId,
					name: this.name,
					date: this.date,
					location: this.location
				};
				$.extend(payload, otherFields);

				console.log(payload);
			}
		}]);

		return Competition;
	}();

	exports.default = Competition;

/***/ }
/******/ ]);