<?php

include_once "lib/swift_required.php";

// Sanitize input
$from_name    = filter_var($_POST["name"],    FILTER_SANITIZE_STRING);
$from_email   = filter_var($_POST["email"],   FILTER_SANITIZE_EMAIL);
$from_message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);

// Prepare message
$text = "Message from $from_name &lt;$from_email&gt;!\n\n$from_message\n";
$html = <<<EOM
	<html>
		<body>
			<p>Message from <b>$from_name &lt;$from_email&gt;</b></p>
			<p>$from_message</p>
		</body>
	</html>
EOM;

// Set FROM and TO e-mails
$from = array('no-reply@senti.com.ph' => 'Senti.com.ph');
$to = array(
   'rv.regalado@gmail.com' => 'Ralph Regalado',
   'esquivel.antonn@gmail.com' => 'Antonn Esquivel'
);

// Email subject
$subject = 'Message from senti.com.ph!';

// Login credentials
$username = 'azure_ae0e5a3b07dece37806310d9681619e4@azure.com';
$password = '2E6sZ2bH2hhAqWe';

// Setup Swift mailer parameters
$transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
$transport->setUsername($username);
$transport->setPassword($password);
$swift = Swift_Mailer::newInstance($transport);

// Create a message (subject)
$message = new Swift_Message($subject);

// Attach the body of the email
$message->setFrom($from);
$message->setBody($html, 'text/html');
$message->setTo($to);
$message->addPart($text, 'text/plain');

// Send message 
if ($recipients = $swift->send($message, $failures)) {
	// This will let us know how many users received this message
	echo 'Message sent out to '.$recipients.' users';

// Something went wrong =(
} else {
	echo "Something went wrong!";
	print_r($failures);
}

