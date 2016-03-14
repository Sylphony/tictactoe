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
