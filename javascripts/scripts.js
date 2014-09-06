(function($) {
  $(window).load(function() {

    /* ---- fastclick - removes 300ms delay from tap ---- */
    $(function() {
      FastClick.attach(document.body);
    });
    /* ---- /fastclick ---- */

    /* ---- off-canvas menu ---- */
    var offcanvasMenuButton = document.getElementById('offcanvas-menu-button');

  	offcanvasMenuButton.onclick = function(e) {
      var site = document.getElementById('site'),
    	    sideNav = document.getElementById('side-nav'),
    		  cl = site.classList,
    		  snCL = sideNav.classList;
    	
      if (cl.contains('open')) {
    	  cl.remove('open');
    	} 
      else {
    	  cl.add('open');
    	}
    };
    /* ---- /offcanvas menu ---- */

  });

  /* ---- swipe functionality for movie advancement ---- */
  $("body").swipe({
    swipeLeft:function(event, direction, distance, duration, fingerCount) {
      $("#next").trigger('click');
    },
    swipeRight:function(event, direction, distance, duration, fingerCount) {
      $("#previous").trigger('click');
    }
  });
  /* ---- /swipe functionality ---- */

})(jQuery);

