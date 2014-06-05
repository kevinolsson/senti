<?php

echo "hello thurr";
print phpinfo();
// Mail sender

// if ($_POST) {
	$to_Email = "esquivel.antonn@gmail.com"; //Replace with recipient email address
	$subject  = 'Ah!! My email from Somebody out there...'; //Subject line for emails
	
	// Check if its an ajax request, exit if not
	// if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	
	// 	// Exit script outputting json data
	// 	$output = json_encode(
	// 	array(
	// 		'type' => 'error', 
	// 		'text' => 'Request must come from Ajax'
	// 	));
		
	// 	die($output);
	// } 
	
	// Check $_POST vars are set, exit if any missing
	if(!isset($_GET["name"]) || !isset($_GET["email"]) || !isset($_GET["message"])) {
		$output = json_encode(
			array(
				'type' => 'error',
				'text' => 'Input fields are empty!'
			)
		);
		die($output);
	}

	// Sanitize input data using PHP filter_var().
	$entry_name    = filter_var($_GET["name"],    FILTER_SANITIZE_STRING);
	$entry_email   = filter_var($_GET["email"],   FILTER_SANITIZE_EMAIL);
	$entry_message = filter_var($_GET["message"], FILTER_SANITIZE_STRING);
	
	// Proceed with PHP email.
	$headers = 'From: '.$entry_email.'' . "\r\n" .
			   'Reply-To: '.$entry_email.'' . "\r\n" .
			   'X-Mailer: PHP/' . phpversion();
	
	// Send mail
	echo "lolbbq";
	$sentMail = mail($to_Email, $subject, $entry_message .'  -'.$entry_name, $headers);
	echo "okayokay..";

	if (!$sentMail) {
		$output = json_encode(
			array(
				'type' => 'error',
				'text' => 'Sorry, we could not send your message!'
			)
		);
		echo "holy shit";
		die($output);
	} else {
		$output = json_encode(
			array(
				'type' => 'message',
				'text' => 'Hi '.$entry_name .', thank you for your message!'
			)
		);
		echo "Oh, good";
		die($output);
	}
// }

?>