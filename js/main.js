$(function() {
	var maincontainer = "#maincontainer";

	// Initialize one page scroll
	$(maincontainer).onepage_scroll({
		sectionContainer: "section.pane", 
		easing: "ease",
		animationTime: 1000,
		pagination: true,
		updateURL: false,
		beforeMove: function(newindex) {
			highlight_toplink(newindex - 1);
		}
	});

	// Nav
	$('a#top-logo').click(function(index){
		$(maincontainer).moveTo(1);
		return false;
	});
	$('nav#top-nav ul li').each(function(index){
		$(this).find('a').click(function(){
			$(maincontainer).moveTo(index + 2);
			return false;
		});
	});

	// Triggers
	$('.pane-1 .bottombutton button').click(function(){
		$(maincontainer).moveDown();
	});
});

function highlight_toplink (index) {
	$('nav#top-nav ul li a').removeClass('active');
	$('nav#top-nav ul li:nth-child('+index+') a').addClass('active');
}
