<?php

// Mail sender

if ($_POST) {
	$to_Email = "esquivel.antonn@gmail.com"; //Replace with recipient email address
	$subject  = 'Ah!! My email from Somebody out there...'; //Subject line for emails
	
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

	//Sanitize input data using PHP filter_var().
	$entry_name    = filter_var($_POST["name"],    FILTER_SANITIZE_STRING);
	$entry_email   = filter_var($_POST["email"],   FILTER_SANITIZE_EMAIL);
	$entry_message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
	
	// Proceed with PHP email.
	$headers = 'From: '.$entry_email.'' . "\r\n" .
	'Reply-To: '.$entry_email.'' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	
	// Send mail
	$sentMail = @mail($to_Email, $subject, $entry_message .'  -'.$entry_name, $headers);
	
	if (!$sentMail) {
		$output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
		die($output);
	} else {
		$output = json_encode(array('type'=>'message', 'text' => 'Hi '.$entry_name .' Thank you for your email'));
		die($output);
	}
}

?>