var wfServices = angular.module('services', []);

//location service
wfServices.factory('locationService', function($http, $q, ngProgress) {
	return {
		getLocation: function() {
			//loading
			ngProgress.start();
			ngProgress.height("2px");
			ngProgress.color("#008cba");
			progressIcon("location", "In");
			// /loading

			var loc = {},
				defer = $q.defer();

			//geolocation latitude and longitude
			navigator.geolocation.getCurrentPosition(function(position) {
				loc.lat = position.coords.latitude,
				loc.lon = position.coords.longitude;

				defer.resolve(loc);

			//if geolocation fails, let's use an ip based backup for coordinates 
			}, function(error) {
				$http.jsonp('http://freegeoip.net/json/?callback=JSON_CALLBACK').success(function(data) {
					loc.lat = data.latitude,
	                loc.lon = data.longitude;
	                
	                defer.resolve(loc);
				});
			});

			return defer.promise;
		}
	}

});
// /location service

//geocode service
wfServices.factory('geocodeService', function($http, $q, ngProgress) {
	return {
		getGeocode: function(lat, lon) {
			var geo = {},
				defer = $q.defer();

			//reverse geocode the location coordinates
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=false').success(function(data) {
			//$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=42.220320,-7.663548&sensor=false').success(function(data) {
			//$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=43.609363,-79.705342&sensor=false').success(function(data) {
				
				//show town and state if in United States, otherwise show province and country
				for (var i=0; i<data.results[0].address_components.length; i++) {
                    for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
	                    if (data.results[0].address_components[i].types[b] == "country") {
	                        geo.province = data.results[0].address_components[i].long_name;  
	                        break;
	                    }
	                    if (data.results[0].address_components[i].types[b] == "political") {
	                        geo.town = data.results[0].address_components[i].long_name;  
	                        break;
	                    }

                    }
                }
                if(geo.province == "United States") {
                	geo.town = data.results[0].address_components[2].long_name,
					geo.province = data.results[0].address_components[5].long_name;
                }

				defer.resolve(geo);
			});
			progressIcon("location", "Out");
			return defer.promise;
		}
	}
});
// /geolocation service

//weather service
wfServices.factory('weatherService', function($http, $q, ngProgress) { 
    return {
    	getWeather: function(lat, lon) {
    		//loading
    		progressIcon("weather", "In");
    		// /loading

    		var weatherURL = 'https://api.forecast.io/forecast/6df47eea72d25a7983e4f60fdf3976bd/',
    			weatherAPI = weatherURL + lat + ',' + lon + '?callback=JSON_CALLBACK',
    			weather = {},
    			defer = $q.defer();

    		$http.jsonp(weatherAPI).success(function(weather) {

    			weather.temperature = weather.currently.temperature,
    			weather.condition = weather.currently.summary,
    			weather.icon = weather.currently.icon;

    			//link weather condition to movie genre ID
    			switch(weather.icon) {
    				case "clear-day":
    				case "clear-night":
					    weather.genres = "35||16"
					    break;
					case "rain": 
						weather.genres = "18"
						break;
					case "snow": 
						weather.genres = "10749||10751"
						break;
					case "sleet":
					case "hail": 
						weather.genres = "80||10756"
						break;
					case "wind":
					case "fog": 
						weather.genres = "9648||10748"
						break;
					case "partly-cloudy-day":
					case "partly-cloudy-night": 
						weather.genres = "28||12"
						break;
					case "cloudy": 
						weather.genres = "14||878"
						break;
					case "thunderstorm": 
					case "heavy-rain":
						weather.genres = "27||53"
						break;
					case "tornado": 
						weather.genres = "105||27"
						break;
					default: 
						weather.genres = "18||28||878"
    			}

    			defer.resolve(weather);
    		});
    		return defer.promise;
    	}
    }
});
// /weather service

//movie service
wfServices.factory('movieService', function($http, $q, ngProgress){
	return {
		getMovies: function(weather) {
			progressIcon("weather", "Out");			
			//loading - delays movie loading icon because weather is contained to one service
			ngProgress.start();
			setTimeout(function() {progressIcon("movie", "In");}, 1);
			// /loading

			var movies = {},
			defer = $q.defer();

			//for our date range in the api call, let's get last year and 24 years earlier
			//last year prevents movies in theaters from showing up, and 24 years prevents really old, obscure movies from showing up
			var date = new Date(),
				year = date.getFullYear() - 1,
				month = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2),
				recentDate = year + "-" + month + "-" + day,
				pastDate = (year - 24) + "-" + month + "-" + day;

			var getRandomNumber = function(min, max) {
			    return Math.random() * (max - min) + min;
			}

			var movieAPI = 'https://api.themoviedb.org/3/discover/movie?api_key=9a1cb20e14822644493c7a44e6890a34&with_genres=' + weather + '&language=en&release_date.lte=' + recentDate + '&release_date.gte=' + pastDate + '&sort_by=popularity.desc&page=' + getRandomNumber(1,50);
			var moviesArray = [];

			$http.get(movieAPI).success(function(movies) {
				for(var i=0; i<10; i++) {
					if(movies.results[i].backdrop_path != null) {
						moviesArray.push(movies.results[i]);
					}
				}

				defer.resolve(moviesArray);
			}).error(function() {
				//local generic json file with movie info in case moviedb fails
				$http.get('javascripts/movie-climate/json/movies.json').success(function(movies) {
					for(var i=0; i<10; i++) {
					if(movies.results[i].backdrop_path != null) {
						moviesArray.push(movies.results[i]);
						}
					}

					defer.resolve(moviesArray);
				});
			});

			return defer.promise;
		}
	}
});
// /movie service

//single movie service
wfServices.factory('singleMovieService', function($http, $q, ngProgress){
	return {
		getSingleMovie: function(id) {
			defer = $q.defer();
			var singleMovie = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=9a1cb20e14822644493c7a44e6890a34';

			$http.get(singleMovie).success(function(movie) {

				defer.resolve(movie);
			}).error(function() {
				//local json files in case moviedb fails (see movie service)				
				$http.get('javascripts/movie-climate/json/'+ id + '.json').success(function(movie) {
					
					defer.resolve(movie);
				});
			});

			setTimeout(function() {progressIcon("movie", "Out");}, 2);
			return defer.promise;
		}
	}
});
// /single movie service
