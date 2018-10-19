$(document).ready(function() {
	$('section#about-me').hide();
	$('section#web-portfolio').hide();
	$('.about-me-icon').click(function(){
		$('section#name').hide();
		$('section#web-portfolio').hide();
		$('section#about-me').fadeIn(1000);
	});
});
