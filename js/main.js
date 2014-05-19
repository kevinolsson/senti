$(function() {

	var maincontainer = "#maincontainer";

	// Initialize one page scroll
	$(maincontainer).onepage_scroll({
		sectionContainer: "section.pane", 
		easing: "ease",
		animationTime: 1000,
		pagination: true,
		updateURL: false,
		beforeMove: function(index) {
			updateState(index);
		},
		afterMove: function(index) {
			// TO DO: Play vid pagination
		}
	});
	// Vertically center button things on the side
	$('.onepage-pagination').css({
		'margin-top': $('.onepage-pagination').height() / -2
	});


	// Nav
	$('a#top-logo, a#top-logo-alt').click(function(index){
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
	fix_hex();


	// Blog
	init_blog();


	// Form
	init_form();


	// Google Maps
	// init_maps();


	// Test
	// $(maincontainer).moveTo(6);


});


// Window resize
$(window).resize(function(){

});



// Update website state depending on the current panel
function updateState (index) {
	// Highlight link
	$('nav#top-nav ul li a').removeClass('active');
	$('nav#top-nav ul li:nth-child('+ (index - 2) +') a').addClass('active');

	// Make header transparent
	if (index < 7) {
		$('header#top').addClass('transparent');
	} else if ($('header#top').hasClass('transparent')) {
		$('header#top').removeClass('transparent');
	}
	if (index == 5) {
		$('header#top').addClass('alt-blue');

		$('a#top-logo-alt').removeClass('hide');
		if (!$('a#top-logo').hasClass('hide')) {
			$('a#top-logo').addClass('hide');
		}
	} else {
		$('header#top').removeClass('alt-blue');

		$('a#top-logo').removeClass('hide');
		if (!$('a#top-logo-alt').hasClass('hide')) {
			$('a#top-logo-alt').addClass('hide');
		}
	}

	// Background color (for blur)
	if (index <= 4) {
		$('body').css('background-color', '#000');
	} else if (index == 6) {
		$('body').css('background-color', '#4EC3C7');
	} else {
		$('body').css('background-color', '#FFF');
	}

	// White pagination
	if (index == 6) {
		$('.onepage-pagination').addClass('white');
	} else if ($('.onepage-pagination').hasClass('white')) {
		$('.onepage-pagination').removeClass('white');
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


// Features hex size
function fix_hex () {

	// Hex tails
	$('div.hex').each(function(){
		var width = $(this).width() / 2;
		$(this).find('div.topend, div.bottomend').css({
			'border-left-width': width,
			'border-right-width': width
		});
	});

	// Hex height
	var maxheight = 0;
	$('div.hex').each(function(){
		if ($(this).height() > maxheight) {
			maxheight = $(this).height();
		}
	});
	$('div.hex').each(function(){
		if ($(this).height() != maxheight) {
			$(this).height(maxheight);
		}
	});

}


// Blog
function init_blog () {
	$.ajax({
		type: 'GET',
		// url: 'http://senti.com.ph/blog/?feed=rss2',
		url: 'http://localhost/senti/blog.xml',
		dataType: 'xml',
		success: function (data) {
			var limit = 4;
			var articles = [];

			$(data).find('item').each(function () {
				var item = $(this);

				if (articles.length < limit) {
					var date = Date.parse(item.find('pubDate').text());

					articles.push({
						'title': item.find('title').text(),
						'link': item.find('link').text(),
						'date': date.toString('MMMM d, yyyy'),
						'creator': item.find('creator').text(),
						'text': item.find('description').text(),
					});
				}
			});

			// Populate
			var blogblock = $('#bigarticle-content');

			// Put first
			var articleblock = blogblock.find('article');
			articleblock.html('<h1 class="blog-title">' + articles[0].title + "</h1>");
			articleblock.append('<div class="blog-byline">' + 'Posted on ' + articles[0].date + ' by ' + articles[0].creator + '</div>');
			articleblock.append('<p>' + articles[0].text + '</p>')

			// Next 3
			var etc = $('#bigarticle-etc ul');
			etc.html('');
			for (var i = 1; i < limit; i++) {
				etc.append('<li><a href="' + articles[i].link + '" target="_blank">' + articles[i].title +'</a></li>')
			}
		},
		error: function (data) {
			// TODO
			console.log("error lol");
		}
	});
}


// Forms
function init_form () {
	// TO DO: Refactor "#demopane"
	// TO DO: Make the form work
	var demopane = $('div#demopane');
	var demopane_text = [
		[
			"Try Senti!",
			"Tell us who you are and we'll let you know when you can start your trial!"
		],
		[
			"Talk to us!",
			"We wanna hear you out. We'll get back to you as soon as we can!"
		],
		[
			"Ask for a Quote",
			"Let us help you in your business. We'll send you a quote for our services!"
		]
	];
	
	// Try
	$('nav#top-nav ul li:last-child a, .pane-5 .button.try').click(function(){
		if (!demopane.hasClass('visible')) {
			demopane.addClass('visible');
			demopane.fadeIn(500);
			demopane.find('h1').html(demopane_text[0][0]);
			demopane.find('h2').html(demopane_text[0][1]);
			demopane.find('input[name="company"]').show();
			demopane.find('textarea').hide();
			// Blur
			// $('#maincontainer, #top').Vague({
			// 	intensity:      10,      // Blur Intensity
			// 	forceSVGUrl:    false   // Force absolute path to the SVG filter
			// }).blur();
		}
	});
	// Contact
	$('nav#top-nav ul li:nth-child(5) a').click(function(){
		if (!demopane.hasClass('visible')) {
			demopane.addClass('visible');
			demopane.fadeIn(500);
			demopane.find('h1').html(demopane_text[1][0]);
			demopane.find('h2').html(demopane_text[1][1]);
			demopane.find('input[name="company"]').hide();
			demopane.find('textarea').show();
		}
	});
	// Ask quote
	$('.pane-5 .button.buy').click(function(){
		if (!demopane.hasClass('visible')) {
			demopane.addClass('visible');
			demopane.fadeIn(500);
			demopane.find('h1').html(demopane_text[2][0]);
			demopane.find('h2').html(demopane_text[2][1]);
			demopane.find('input[name="company"]').show();
			demopane.find('textarea').hide();
		}
	});
	// Hide the pane
	$('div#demopane .overlay').click(function(){
		demopane.removeClass('visible');
		demopane.fadeOut(500);
		// Vague.unblur();
	});
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
		zoom: 16,
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
		closeBoxMargin: "35px 5px 0 0",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	};

	var ib = new InfoBox(myOptions);
	ib.open(map, marker);
}