(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./controllers/BoardCtrl":2,"./controllers/ScoreCtrl":3,"./directives/clearBoard":4,"./directives/scoreUpdate":5,"./directives/selectTile":6,"./services/board":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = function clearBoard() {
	"use strict";

	return {
		restrict: "A",
		link: function(scope, ele) {

			ele.on("click", function() {
				var boardEle = document.getElementById("board");
				
				angular.element(boardEle)
					.children()
					.removeClass("board__tile--X board__tile--O");
			});

		}
	};
};

},{}],5:[function(require,module,exports){
/* Updates the score */
module.exports = function() {
	"use strict";
	
	return {
		restrict: "A",
		link: function(scope, ele, attr, ctrl) {

			scope.$on("updateScore", function(evt, playerMark) {
				scope.$apply(function() {
					scope.score.addScore(playerMark);
				});
			});
			
		}
	};
};

},{}],6:[function(require,module,exports){
module.exports = function selectTile(board, $rootScope) {
	"use strict";
	
	return {
		restrict: "A",
		link: function(scope, ele) {

			ele.on("click", function(e) {
				var boardCtrl = scope.$parent.board;

				if (boardCtrl.gameOpen) {
					// Get the current player and tile number
					var currentPlayer = boardCtrl.currentPlayer;
					var tileNum = ele.attr("data-tile-num");

					// Only allow the tile to be placed if it is empty
					if (board.isTileEmpty(tileNum)) {

						// Set the mark
						board.setMark(tileNum, currentPlayer);
						ele.addClass("board__tile--" + currentPlayer);

						// Check the state of the board
						var resultState = board.checkResult(currentPlayer);

						// Win result
						if (resultState === "win") {
							boardCtrl.gameOver();

							$rootScope.$broadcast("updateScore", currentPlayer);
						}

						// Tie result
						else if (resultState === "tie") {
							boardCtrl.gameOver();
							
							$rootScope.$broadcast("updateScore", "Tie");
						}

						// In progress
						else {
							scope.$apply(function() {
								boardCtrl.switchPlayers();
							});
						}
					}
				}
			});

		}
	};
};



},{}],7:[function(require,module,exports){
module.exports = function boardFactory() {
	"use strict";
	
	var Board = [
		{ row: 0, col: 0, mark: null, isWinTile: false },
		{ row: 0, col: 1, mark: null, isWinTile: false },
		{ row: 0, col: 2, mark: null, isWinTile: false },
		{ row: 1, col: 0, mark: null, isWinTile: false },
		{ row: 1, col: 1, mark: null, isWinTile: false },
		{ row: 1, col: 2, mark: null, isWinTile: false },
		{ row: 2, col: 0, mark: null, isWinTile: false },
		{ row: 2, col: 1, mark: null, isWinTile: false },
		{ row: 2, col: 2, mark: null, isWinTile: false }
	];

	/*
	 * setMark()
	 * Sets the mark on board.
	 */
	Board.setMark = function(tileNum, mark) {
		this[tileNum].mark = mark;
	};

	/*
	 * isTileEmpty()
	 * Checks if a tile has null space.
	 */
	Board.isTileEmpty = function(tileNum) {
		return (this[tileNum].mark === null);
	};

	/*
	 * getMarkLocations()
	 * Get the tiles with marks.
	 */
	Board.getMarkLocations = function(mark) {
		var theBoard = this;
		var tilesWithMark = [];

		for (var tileNum = 0; tileNum < theBoard.length; tileNum++) {
			if (theBoard[tileNum].mark === mark) {
				tilesWithMark.push(theBoard[tileNum]);
			}
		}

		return tilesWithMark;
	};


	/*
	 * checkResult()
	 * Checks the result.
	 */
	Board.checkResult = function(mark) {
		var theBoard = this;
	
		// Check for win
		var winResults = theBoard.checkWin(mark);

		// If any win results
		if (Object.keys(winResults).length > 0) {
			
			for (var arrResult in winResults) {
				// For each tile part of the win, set to true.
				winResults[arrResult].forEach(function(tile) {
					// Search through the board to find the tile
					for (var tileNum = 0; tileNum < theBoard.length; tileNum++) {
						if (tile.$$hashKey === theBoard[tileNum].$$hashKey) {
							theBoard[tileNum].isWinTile = true;
						}
					}
				});
			}

			return "win";
		}

		else {
			var tilesFilledCount = theBoard.getFilledTilesCount();

			if (tilesFilledCount === 9) {
				return "tie";
			}

			return "progress";
		}
	};

	/* Check board win */
	Board.checkWin = function(mark) {
		var theBoard = this;
		var winResults = {};

		var tilesWithMark = theBoard.getMarkLocations(mark);

		// Checks don't need to take place until at least 3 marks appear on the board for a player
		if (tilesWithMark.length > 2) {
			// Get all results
			winResults = {
				"rowResult": theBoard.checkRows(tilesWithMark),
				"colResult": theBoard.checkCols(tilesWithMark),
				"topDiagResult": theBoard.checkTopDiag(tilesWithMark),
				"bottomDiagResult": theBoard.checkBottomDiag(tilesWithMark)
			};

			// Only keep the results that actually do lead to win
			winResults = function() {
				var filteredResults = {};

				for (var arrResult in winResults) {
		        	if (winResults[arrResult].length === 3) {
		            	filteredResults[arrResult] = winResults[arrResult];
		        	}
		        }

		        return filteredResults;
		    }();
		}

		return winResults;
	};

	/* Get filled tiles count */
	Board.getFilledTilesCount = function() {
		var theBoard = this;

		var tilesFilledX = theBoard.getMarkLocations("X");
		var tilesFilledO = theBoard.getMarkLocations("O");

		return tilesFilledX.length + tilesFilledO.length;
	};

	/* Check if any rows have all 3 marks */
	Board.checkRows = function(tilesWithMark) {
		// Array for tracking matched tiles
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			if (index !== 0) {
				// Comparison between current mark and previous mark's location
				// If doesn't match, start over again
				if (tilesWithMark[index].row !== tilesWithMark[index-1].row) {
					matchedTiles = [];
				}
			}

			// Each time, add a tile to the array
			matchedTiles.push(tilesWithMark[index]);

			// If the number of matched tiles is 3, win decided
			if (matchedTiles.length === 3) {
				break;
			}
		}

		return matchedTiles;
	};

	/* Check if any columns have all 3 marks */
	Board.checkCols = function(tilesWithMark) {
		// Sort the array to column order instead (it being unstable makes no difference)
		tilesWithMark.sort(function(tile1, tile2) {
			return tile1.col > tile2.col;
		});

		// Array for tracking matched tiles
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			if (index !== 0) {
				// Comparison between current mark and previous mark's location
				// If doesn't match, start over again
				if (tilesWithMark[index].col !== tilesWithMark[index-1].col) {
					matchedTiles = [];
				}
			}

			// Each time, add a tile to the array
			matchedTiles.push(tilesWithMark[index]);

			// If the number of matched tiles is 3, win decided
			if (matchedTiles.length === 3) {
				break;
			}
		}

		return matchedTiles;
	};

	/* Check if the top left-to-right diagonal have all 3 marks */
	Board.checkTopDiag = function(tilesWithMark) {
		// Count how many times a mark appears in the diagonal
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			// Each time the column and row matches, increment count
			if (tilesWithMark[index].row === tilesWithMark[index].col) {
				matchedTiles.push(tilesWithMark[index]);
			}

		}

		return matchedTiles;
	};

	/* Check if the bottom left-to-right diagonal have all 3 marks */
	Board.checkBottomDiag = function(tilesWithMark) {
		// Count how many times a mark appears in the diagonal
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			// Each time the sum of the row and column is 2, increment count
			if (tilesWithMark[index].row + tilesWithMark[index].col === 2) {
				matchedTiles.push(tilesWithMark[index]);
			}

		}

		return matchedTiles;
	};

	return Board;
};

},{}]},{},[1]);
