var wfFunctions = angular.module('functions', []);

/* ---- movie average functions - converts to five star system ---- */
var movieAvg = function(rating) {
	number = (rating / 2);
	return Math.round( number * 10 ) / 10;
};

var stars = function(stars) {
	var avg,
		starArray = [],
		starScreen,
		starWidth;
	if(stars == 0) {
		avg = "Not yet rated";
		$('.star-background').css({'display':'none'});
	}
	else {
		for(var i=0; i<=stars; i++) {
			starArray.push(i);
			avg = stars;
		}
	}

	if(window.innerWidth >= 1024) {
		starScreen = 0.50;
	}
	else {
		starScreen = 0.35;
	}
	starWidth = Math.floor((Math.floor((avg % 1) * 100)) * starScreen) + "px";

	return {avg:avg, starArray:starArray, starWidth:starWidth};
}

/* ---- /movie average ---- */

//fades out ngProgress container
var progressFade = function() {
	var ngProgress = document.getElementById("ngProgress-container");
	ngProgress.className = "animated fadeOut loading-done";
};

var progressIcon = function(stage, entrance) {
	var icon = document.getElementById("loading-icons");
	icon.className = stage + " animated fade" + entrance + "Up"
}
