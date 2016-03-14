module.exports = function BoardCtrl(board) {
	"use strict";

	var self = this;

	// Set the board
	self.board = board;

	// The game state is open
	self.gameOpen = true;

	// Current player
	self.currentPlayer = "X";

	// Switch players
	self.switchPlayers = function() {
		if (self.currentPlayer === "X") {
			self.currentPlayer = "O";
		}
		
		else if (self.currentPlayer === "O") {
			self.currentPlayer = "X";
		}
	};

	// Set game state to over
	self.gameOver = function() {
		self.gameOpen = false;

		// Update the board
		self.board = board;
	};

	self.gameWin = function() {
		self.gameOver();
	};

	// Reset the board's state
	self.resetBoard = function() {
		self.gameOpen = true;

		for (var tileNum = 0; tileNum < self.board.length; tileNum++) {
			self.board[tileNum].mark = null;
			self.board[tileNum].isWinTile = false;
		}

		// If win: Switch to loser player
		// If tie: Switch to other player to start the game
		self.switchPlayers();
	};
};
