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


