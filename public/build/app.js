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
	$(".gymnasts").submit(function (e) {
		e.preventDefault();
		var name = $(".nameinput").val();
		var age = $(".ageinput").val();
		var gender = $(".genderlist").val();
		var level = $(".levellist").val();
		var gymnast = new _Gymnast2.default(name, age, gender, level);
		gymnast.save(onGymnastSave);
		$(".nameinput").val("").focus();
		$(".ageinput").val("");
		$(".genderlist").val("");
		$(".levellist").val("");
	});

	function onGymnastSave(data) {
		var gymnastList = $('.gymnast-list');
		var i = gymnastCollection.length;
		gymnastList.append(addGymnast(i, data));
	}

	function fetchGymnast() {
		$(".nameinput").focus();
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

	$('.gymnast-list').on('click', ".add-competition", function () {
		$(".nameinput").val("").focus();
		var form = $('.templates > .competitions').clone();
		var id = $(this).parent().attr("data-id");
		form.find(".userIdInput").val(id);
		$(this).parent().append(form);
	});

	$('.gymnast-list').on('click', '.saveCompetition', function (e) {
		e.preventDefault();
		var form = $(this).parent();
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
		var competition = new _competition2.default(userId, name, date, location);
		competition.save(function (data) {
			var competitionList = form.parent().find(".competition-list");
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

	$('.gymnast-list').on('click', ".edit-gymnast", function () {
		var gymnastEl = $(this).parent();
		var userId = gymnastEl.attr('data-id');
		$.ajax('/gymnast/' + userId, {
			type: 'PUT',
			dataType: 'json',
			contentType: 'application/json'
		}).done(function (editGymnast) {});
	});

	$('.gymnast-list').on('click', ".show-competitions", function () {
		$(".nameinput").val("").focus();
		var gymnastEl = $(this).parent();
		var userId = gymnastEl.attr('data-id');
		var competitionList = gymnastEl.find(".competition-list");
		$.ajax('/gymnast/' + userId + '/competition', {
			type: 'GET',
			contentType: 'application/json'
		}).done(function (competitionArray) {
			for (var i = 0; i < competitionArray.length; i++) {
				var data = competitionArray[i];
				competitionList.append(addCompetition(data));
			}
		});
	});

	$('.gymnast-list').on('click', ".delete-button", function () {
		var _this = this;

		var position = $(this).parent().attr('data-position');
		var gymnast = gymnastCollection[position];
		gymnast.remove(function (onRemove) {
			$(_this).parent().remove();
			console.log(_this);
			gymnastCollection.splice(position, 1);
		});
	});

	$('.gymnast-list').on('click', ".delete-competition", function () {
		var _this2 = this;

		var compEl = $(this).parent();
		var gymnastEl = compEl.parent().parent();
		var userId = gymnastEl.attr('data-id');
		var compId = compEl.attr('data-id');
		$.ajax('/gymnast/' + userId + '/competition/' + compId, {
			type: 'DELETE',
			dataType: 'json'
		}).done(function () {
			$(_this2).parent().remove();
		});
	});

	fetchGymnast();

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
			value: function remove(gymnastObject, onRemove) {
				$.ajax('/gymnast/' + this.id, {
					type: 'DELETE',
					dataType: 'json'
				}).done(onRemove);
			}
		}]);

		return Gymnast;
	}();

	exports.default = Gymnast;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

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
			key: 'save',
			value: function save(onSave, otherFields) {
				var payload = {
					userId: this.userId,
					name: this.name,
					date: this.date,
					location: this.location
				};
				$.extend(payload, otherFields);

				console.log(payload);
				$.ajax('/gymnast/' + this.userId + '/competition', {
					type: 'POST',
					data: JSON.stringify(payload),
					dataType: 'json',
					contentType: 'application/json'
				}).done(onSave);
			}
		}]);

		return Competition;
	}();

	exports.default = Competition;

/***/ }
/******/ ]);