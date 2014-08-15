var wfDirectives = angular.module('directives', []);

var animationLength = 500,
    animationLengthSlow = 1500;

/* ---- directives to trigger animation classes ---- */
wfDirectives.directive("animateEnter", function($animate, $timeout) {
    return function(scope, element, attrs) {
        scope.$whenReady(function() {
            scope.$watch(attrs.animateEnter, function() {
                $animate.addClass(element, "fadeInStart");
                $timeout(function(){
                    $animate.removeClass(element, "fadeInStart");
                },animationLength);
            })
        })
    }
});


wfDirectives.animation(".fadeInStart", function() {
    return {
        addClass: function(element, className) {
            element.addClass("fadeInUp");
        },
        removeClass: function(element, className) {
            element.removeClass("fadeInUp");
        }
    }
});

wfDirectives.directive("animateEnterFront", function($animate, $timeout) {
    return function(scope, element, attrs) {
    	scope.$whenReady(function() {
	        scope.$watch(attrs.animateEnterFront, function() {
	        	$animate.addClass(element, "fadeInStart1");
	        	$timeout(function(){
		            $animate.removeClass(element, "fadeInStart1");
		        },animationLengthSlow);
	        })
    	})
    }
});


wfDirectives.animation(".fadeInStart1", function() {
    return {
        addClass: function(element, className) {
            element.addClass("fadeIn");
        },
        removeClass: function(element, className) {
            element.removeClass("fadeIn");
        }
    }
});
/* ---- /directives to trigger animation classes ---- */

//background image directive
wfDirectives.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'
            });
        });
    };
});
