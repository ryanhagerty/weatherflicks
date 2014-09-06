var wfController = angular.module('controllers', []);

wfController.controller("mainController", function($http, $q, $scope, ngProgress, locationService, geocodeService, weatherService, movieService, singleMovieService) {
  $scope.$prepareForReady();
  $scope.loading = "1/3 - Loading Your Location";
  $scope.done = true;
  $scope.animateOn = false;

  //all aboard the promise chain train!
  //LOCATION SERVICE
  locationService.getLocation().then(function(position) {

    //GEOCODE SERVICE
      geocodeService.getGeocode(position.lat, position.lon).then(function(geo) {

      //show town and province/country
      $scope.place = geo.town + ", " + geo.province;
      $scope.loading = "2/3 - Loading Your Weather";
      ngProgress.reset();

      //WEATHER SERVICE       
      weatherService.getWeather(position.lat, position.lon).then(function(weather) {
        $scope.condition = weather.condition;
        $scope.temperature = weather.temperature.toFixed(1) + '\u00B0';

        //weather icon
        $scope.CurrentWeather = {
          forecast: {
            icon: weather.icon
          }
        };

        //get favicon based on weather icon
        $scope.favImage = "images/favs/" + $scope.CurrentWeather.forecast.icon + ".png";
        var favIcon = angular.element(document.getElementById('body')).scope().favImage + "?v=2";
        document.getElementById("fav").setAttribute("href",favIcon);

        $scope.animateOn = !($scope.animateOn);
        $scope.loading = "3/3 - Loading Your Movies";
        ngProgress.reset();
        $scope.done = true;

          //MOVIE SERVICE 
          movieService.getMovies(weather.genres).then(function(moviesArray) {
            $scope.$onReady();
            $scope.moviesArray = moviesArray;                   
            var count = 0;
            $scope.count = count;
            $scope.id = moviesArray[count].id;

            $scope.getSingleMovie = function() {
                  
              //SINGLE MOVIE SERVICE
              singleMovieService.getSingleMovie($scope.id).then(function(movie) {

                $scope.tagline = movie.tagline;
                $scope.overview = movie.overview;
                $scope.runtime = movie.runtime + " min";
                if(movie.runtime == 0 || movie.runtime == null) {
                  $scope.runtime = "No Runtime Available";
                }
              });
            }

            //displays side-nav once content is loaded
            var sideNav = document.getElementById('side-nav');
            $(sideNav).css({'opacity':1});

            //fades out ngProgress container
            var progressFade = function() {
              var ngProgress = document.getElementById("ngProgress-container");
              ngProgress.className = "animated fadeOut loading-done";
            };

            $scope.getSingleMovie();
            ngProgress.complete(progressFade());
            setTimeout(function(){$scope.done = false;},250);

        });
      });
    });
  });
});

