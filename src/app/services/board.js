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

	/* Sets the mark on board. */
	Board.setMark = function(tileNum, mark) {
		this[tileNum].mark = mark;
	};

	/* Checks if a tile has null space. */
	Board.isTileEmpty = function(tileNum) {
		return (this[tileNum].mark === null);
	};

	/* Get the tiles with marks. */
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

	/* Checks the result. */
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
		// Array for tracking matched tiles
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			// Each time the column and row matches, add a tile to the array
			if (tilesWithMark[index].row === tilesWithMark[index].col) {
				matchedTiles.push(tilesWithMark[index]);
			}

		}

		return matchedTiles;
	};

	/* Check if the bottom left-to-right diagonal have all 3 marks */
	Board.checkBottomDiag = function(tilesWithMark) {
		// Array for tracking matched tiles
		var matchedTiles = [];

		for (var index = 0; index < tilesWithMark.length; index++) {
			// Each time the sum of the row and column is 2, add a tile to the array
			if (tilesWithMark[index].row + tilesWithMark[index].col === 2) {
				matchedTiles.push(tilesWithMark[index]);
			}

		}

		return matchedTiles;
	};

	return Board;
};
