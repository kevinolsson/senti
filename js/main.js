$(function() {

	$('.pane').height(800);
	// Main container ID
	var maincontainer = "#maincontainer";

	// Initialize one page scroll
	// $(maincontainer).onepage_scroll({
	// 	sectionContainer: "section.pane", 
	// 	easing: "ease",
	// 	animationTime: 1000,
	// 	pagination: false,
	// 	updateURL: false,
	// 	beforeMove: function(index) {
	// 		updateState(index);
	// 	},
	// 	afterMove: function(index) {}
	// });
	// Vertically center button things on the side
	$('.onepage-pagination').css({
		'margin-top': $('.onepage-pagination').height() / -2
	});


	// Nav - Logo
	$('a#top-logo, a#top-logo-alt').click(function(index){
		$(maincontainer).moveTo(1);
		return false;
	});
	// Nav - Links
	$('nav#top-nav ul li').each(function(index){
		$(this).find('a').click(function(){
			$(maincontainer).moveTo(index + 3);
			return false;
		});
	});
	// Links that go to contacts page
	$('nav#top-nav ul li:last-child a, nav#top-nav ul li:nth-child(5) a, .pane-5 .button.try, .pane-5 .button.buy').click(function(){
	   	$(maincontainer).moveTo(7);
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


	// Contact Form
	init_form();


	// Google Maps (Disabled)
	// init_maps();


	// Test
	// $(maincontainer).moveTo(7);


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
	if (index < 8) {
		$('header#top').addClass('transparent');
	} else if ($('header#top').hasClass('transparent')) {
		$('header#top').removeClass('transparent');
	}
	if (index == 5 || index == 7) {
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
		url: '/blog/?feed=rss2',
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
						'text': item.find('description').text()
					});
				}
			});

			// Check if there are articles
			if (articles.length <= 0) {
				return;
			}

			// Populate
			var blogblock = $('#bigarticle-content');
			var articleblock = blogblock.find('article');
			var etc = $('#bigarticle-etc ul');
			etc.html('');

			$(articles).each(function(index){
				if (index == 0) {
					articleblock.html('<a href="' + this.link + '" target="_blank"><h1 class="blog-title">' + this.title + "</h1></a>");
					articleblock.append('<div class="blog-byline">' + 'Posted on ' + this.date + ' by ' + this.creator + '</div>');
					articleblock.append('<p>' + articles[0].text + '</p>');
					articleblock.append('<p><a href="' + this.link + '" target="_blank">Read full article</a></p>');
				} else {
					etc.append('<li><a href="' + this.link + '" target="_blank">' + this.title +'</a></li>')
				}
			});
		},
		error: function (data) {
			console.log("Could not retrieve blog articles.");
		}
	});
}


// Forms
function init_form () {
	var form_id = 'div#contact-form form';
	var fields = [
		'input[name="name"]',
		'input[name="email"]',
		'textarea[name="message"]'
	];
	var testEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;

	// Submit form
	$(form_id).submit(function(){

		// Validate values
		var isValid = true;
		$(fields).each(function(){
			var field = form_id + ' ' + this;
			var value = $(field).val();
			if ($.trim(value).length == 0 ||
				(field == 'input[name="email"]' && !testEmail.test(value))) {
				$(field).addClass('shake');
				$(field).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$(this).removeClass('shake');
				});
				isValid = false;
			}
		});

		// Send 
		if (isValid) {
			var post_data = {
				'name': $(form_id + ' ' + fields[0]).val(),
				'email': $(form_id + ' ' + fields[1]).val(),
				'message': $(form_id + ' ' + fields[2]).val(),
			};
			$.ajax({
				url: 'contact.php',
				type: 'post',
				data: post_data,
				success: function () {
					alert('Thank you, ' + post_data['name'] + ', for your message!');
					$(fields).each(function(){
						$(form_id + ' ' + this).val('');
					});
				},
				error: function () {
					alert('Sorry, our bad. We can\'t send your message');
					$(form_id + ' input[type="submit"]').addClass('shake');
					$(form_id + ' input[type="submit"]').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$(this).removeClass('shake');
					});
				}
			});
		}

		return false;
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


$(window).on('scroll', function() {
    var y_scroll_pos = window.pageYOffset;
    var scroll_pos_test = 4500;             // set to whatever you want it to be

    if(y_scroll_pos > scroll_pos_test) {
    		$("#maincontainer").css( "transform", "scale(.9,.9)" );
    } else {
    		$("#maincontainer").css( "transform", "scale(1,1)" );
    }
});