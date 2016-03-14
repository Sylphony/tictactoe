module.exports = function scoreUpdate() {
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
