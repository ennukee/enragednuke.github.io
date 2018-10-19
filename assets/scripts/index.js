$(document).ready(function() {
	$('.linkedin').hover(function() {
		if( $('#linkedin-short').is(":visible") ) {
			$('#linkedin-short').hide()
			$('#linkedin-expanded').fadeIn(500)
		} else {
			$('#linkedin-expanded').hide()
			$('#linkedin-short').fadeIn(500)
		}
	});

	$('.about-me').hover(function() {
		if ( $('#about-me-short').is(":visible") ) {
			$('#about-me-short').hide()
			$('.about-me-icon').width(100)
			$('#about-me-expanded').css("font-size", "18px")
			$('#about-me-expanded').fadeIn(500)
		} else {
			$('#about-me-expanded').hide()
			$('.about-me-icon').width(38)
			$('#about-me-short').css("font-size", "30px")
			$('#about-me-short').fadeIn(500)
		}
	})

	$('.portfolio').hover(function() {
		if( $('#portfolio-short').is(":visible") ) {
			$('#portfolio-short').hide()
			$('.portfolio-icon').width(150)
			$('#portfolio-expanded').css("font-size", "18px")
			$('#portfolio-expanded').fadeIn(500)
		} else {
			$('#portfolio-expanded').hide()
			$('.portfolio-icon').width(38)
			$('#portfolio-short').css("font-size", "13px")
			$('#portfolio-short').fadeIn(500)
		}
	});
});