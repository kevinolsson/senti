$(function() {

	var maincontainer = "#maincontainer";


	// Initialize one page scroll
	$(maincontainer).onepage_scroll({
		sectionContainer: "section.pane", 
		easing: "ease",
		animationTime: 000,
		pagination: true,
		updateURL: false,
		beforeMove: function(index) {
			updateState(index);
		},
		afterMove: function(index) {
			// TO DO: Play vid pagination
		}
	});


	// Nav
	$('a#top-logo').click(function(index){
		$(maincontainer).moveTo(1);
		return false;
	});
	$('nav#top-nav ul li').each(function(index){
		$(this).find('a').click(function(){
			$(maincontainer).moveTo(index + 3);
			return false;
		});
	});


	// Triggers
	$('.pane-1 .bottombutton button').click(function(){
		$(maincontainer).moveDown();
	});


	// Video
	var videoPlayer = videojs("#senti-vid");
	if (videoPlayer) {
		videoPlayer.volume(0.6);
	}


	// Features
	$('div.hex').each(function(){
		var width = $(this).width() / 2;
		$(this).find('div.topend, div.bottomend').css({
			'border-left-width': width,
			'border-right-width': width
		});
	});


	// Google Maps
	init_maps();


	// Test
	$(maincontainer).moveTo(4);

});



// Update website state depending on the current panel
function updateState (index) {
	// Highlight link
	$('nav#top-nav ul li a').removeClass('active');
	$('nav#top-nav ul li:nth-child('+ (index - 2) +') a').addClass('active');

	// Make header transparent
	if (index == 1 || index == 2 || index == 4 || index == 6) {
		$('header#top').addClass('transparent');
	} else if ($('header#top').hasClass('transparent')) {
		$('header#top').removeClass('transparent');
	}

	// Play/pause video
	var videoPlayer = videojs("#senti-vid");
	if (videoPlayer) {
		if (index == 2) {
			videoPlayer.play();
		} else {
			videoPlayer.pause();
		}
	}
}


// Google Maps
function init_maps () {
	var latLng = new google.maps.LatLng(14.6222357, 121.0565551);
	var myOptions = {
		panControl: false,
		zoomControl: false,
		mapTypeControl: true,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: true,
		draggable: true,
		disableDoubleClickZoom: true,
		scrollwheel: false,
		zoom: 17,
		center: latLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map($("div#bgmap")[0], myOptions);

	var markerlatlng = new google.maps.LatLng(14.6222357, 121.0565551);
	var marker = new google.maps.Marker({
		position: markerlatlng,
		title: "Senti Main Office",
		animation: google.maps.Animation.DROP
	});
	marker.setMap(map);


	var boxText = " \
		<div id='maptooltip'> \
			<h1>SENTI Main Office</h1> \
			<address>Cubao Expo, General Romulo Street<br />Araneta Center, Cubao</address> \
			<h2>contactus <span>@</span> senti.com.ph</h2> \
		</div> \
	";

	var myOptions = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-175, 0),
		zIndex: null,
		boxStyle: {},
		closeBoxMargin: "25px 5px 0 0",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	};

	var ib = new InfoBox(myOptions);
	ib.open(map, marker);
}