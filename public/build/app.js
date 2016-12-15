(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	}]);

	return Gymnast;
}();

exports.default = Gymnast;

},{}],2:[function(require,module,exports){
"use strict";

var _Gymnast = require("./Gymnast");

var _Gymnast2 = _interopRequireDefault(_Gymnast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(".gymnasts").submit(function (e) {
	e.preventDefault();
	var name = $(".nameinput").val();
	var age = $(".ageinput").val();
	var gender = $(".genderlist").val();
	var level = $(".levellist").val();
	var gymnast = new _Gymnast2.default(name, age, gender, level);
	gymnast.save(onGymnastSave);
});

function onGymnastSave(data) {
	var gymnastList = $('.gymnast-list');
	gymnastList.append(addGymnast(data));
}

function fetchGymnast() {
	var gymnastList = $('.gymnast-list');
	$.ajax('/gymnast', {
		type: 'GET',
		contentType: 'application/json'
	}).done(function (gymnastArray) {
		for (var i = 0; i < gymnastArray.length; i++) {
			var data = gymnastArray[i];
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

$('.gymnast-list').on('click', ".delete-button", function () {
	var id = $(this).attr('data-id');
	console.log(id);

	$.ajax('/gymnast/' + id, {
		type: 'DELETE',
		dataType: 'json'
	}).done(function (removeGymnast) {
		$(this).parent().remove();
	});
});

fetchGymnast();

},{"./Gymnast":1}]},{},[2]);
