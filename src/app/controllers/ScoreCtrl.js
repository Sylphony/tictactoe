module.exports = function ScoreCtrl() {
	"use strict";
	
	var self = this;

	self.scoreX = 0;
	self.scoreO = 0;
	self.scoreTie = 0;

	self.addScore = function(playerMark) {
		self["score" + playerMark] += 1;
	};
};
