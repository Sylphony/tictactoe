(function() {
	"use strict";
	
	var board = require("./services/board");
	var BoardCtrl = require("./controllers/BoardCtrl");
	var ScoreCtrl = require("./controllers/ScoreCtrl");
	var selectTile = require("./directives/selectTile");
	var clearBoard = require("./directives/clearBoard");
	var scoreUpdate = require("./directives/scoreUpdate");

	// The app module
	var app = angular.module("ticTacToe", []);

	// Services
	app.factory("board", board);

	// Controllers
	app.controller("BoardCtrl", ["board", BoardCtrl]);
	app.controller("ScoreCtrl", ScoreCtrl);

	// Directives
	app.directive("selectTile", ["board", "$rootScope", selectTile]);
	app.directive("clearBoard", clearBoard);
	app.directive("scoreUpdate", scoreUpdate);
})();
