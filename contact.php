<?php

/* 
	TON NOTES:

	- Please remove the "if" checkers if this still doesn't work, just straight to the $sendgrid portion (but don't remove the last $output part)
	- Please provide credentials
	- This comment can be removed if necessary lol
*/

require("sendgrid-php.php");

// Mail sender
if ($_POST) {
	
	// Check if its an ajax request, exit if not
	if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	
		// Exit script outputting json data
		$output = json_encode(
		array(
			'type' => 'error', 
			'text' => 'Request must come from Ajax'
		));
		
		die($output);
	} 
	
	// Check $_POST vars are set, exit if any missing
	if(!isset($_POST["name"]) || !isset($_POST["email"]) || !isset($_POST["message"])) {
		$output = json_encode(
			array(
				'type' => 'error',
				'text' => 'Input fields are empty!'
			)
		);
		die($output);
	}

	// Sanitize input data using PHP filter_var().
	$from_name    = filter_var($_POST["name"],    FILTER_SANITIZE_STRING);
	$from_email   = filter_var($_POST["email"],   FILTER_SANITIZE_EMAIL);
	$from_message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
	
	// Send mail using SendGrid
	$sendgrid = new SendGrid('username', 'password');
	$email    = new SendGrid\Email();
	$email->addTo('hello@senti.com.ph')->
			setFrom($from_email)->
			setSubject('Message from senti.com.ph')->
			setText($from_message)->
			setHtml($from_message);
	$sendgrid->send($email);

	// Tell front end that the
	$output = json_encode(
		array(
			'type' => 'message',
			'text' => 'Hi '.$from_name .', thank you for your message!'
		)
	);
	die($output);
}

?>