var wfSlider = angular.module('wfSlider', ['movieClimate']);

wfSlider.directive('wfSlider', ['singleMovieService', function() {

  return {
    templateUrl:  'templates/slider.html',
	restrict:  'AE',
	transclude: true,
	controller: function($scope) {
	  $scope.$whenReady(function() {
	    this.movieAnimateIn = false;
	    $scope.$watch('count', function() {
					
		  //time to assemble all the movie assets
		  var backgroundPath = $scope.moviesArray[$scope.count].backdrop_path,
		  posterPath = $scope.moviesArray[$scope.count].poster_path,
		  title = $scope.moviesArray[$scope.count].title,
		  year = $scope.moviesArray[$scope.count].release_date.slice(0,4),
		  vote_average = $scope.moviesArray[$scope.count].vote_average;

		  if($scope.count < ($scope.moviesArray.length - 1)) {
		    var	posterPathNext = $scope.moviesArray[$scope.count + 1].poster_path;
			$scope.posterNext = 'http://image.tmdb.org/t/p/w370/' + posterPathNext;
			$scope.finishedListNext = false;
		  }
		  else {
		    $scope.finishedListNext = true;
		  }

		  if($scope.count == 0) {
		    $scope.finishedListPrev = true;
		  }
		  else {
		    $scope.finishedListPrev = false;
		   }

		  $scope.title = title;
		  $scope.year = year;			
		  $scope.background = 'http://image.tmdb.org/t/p/w500/' + backgroundPath;

		  //if there's not a poster image for the movie, just leave blank
		  if(posterPath != null) {
		    $scope.poster = 'http://image.tmdb.org/t/p/w370/' + posterPath;		
		  }
		  else {
		    $scope.poster = "../images/imgNotAvailable.jpg";
		  }
					
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
			  starScreen = 0.4;
			}
			else {
			  starScreen = 0.35;
			}
			starWidth = Math.floor((Math.floor((avg % 1) * 100)) * starScreen) + "px";
			return {avg:avg, starArray:starArray, starWidth:starWidth};
		  }
		  /* ---- /movie average ---- */

		  //vote average
		  var rating = stars(movieAvg(vote_average));
		  $scope.avg = rating.avg + " / 5";
		  $scope.starArray = rating.starArray;
		  $scope.starWidth = rating.starWidth;

		});
	  });
			
	  $scope.nextMovie = function() {
	    if($scope.count <= ($scope.moviesArray.length - 2)) {

	    //go to the next movie in the array and get the single movie json, which has info the main json doesn't contain
 	    $scope.count++;
 	    $scope.id = $scope.moviesArray[$scope.count].id;
      
        $scope.getSingleMovie();
	      this.fadeIn = function() {
		    this.movieAnimateIn = !this.movieAnimateIn;
		  }
	    }	
	  };

	  $scope.previousMovie = function() {
	    if($scope.count > 0) {		
 	      $scope.count--;
 		  $scope.id = $scope.moviesArray[$scope.count].id;
		  $scope.getSingleMovie();
	    }
	  };
    }
  }
}]);



