<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['username'];
    $email = $_POST['email'];
    $phoneno = $_POST['phoneno'];
    $address = $_POST['address'];

    $agepoints = 0;// age
    $liveinaus = 0; // live in aus
    $qualifiaction = 0; // qualifiaction
    $exinaus =  0;//Experinece in aus
    $workexp = 0; //Work Experience
    $workpro = 0; //Word profiency
    $married = 0; //Are you married 

    $total = 0;

    $agepoints = $_POST['question-0'];// age
    $liveinaus = $_POST['question-1']; // live in aus
    $qualifiaction = $_POST['question-2']; // qualifiaction
    $exinaus = $_POST['question-3']; //Experinece in aus
    $workexp = $_POST['question-4']; //Work Experience
    $workpro = $_POST['question-5']; //Word profiency
    $married = $_POST['question-6']; //Are you married 



    $total = $agepoints + $liveinaus + $qualifiaction + $exinaus + $workexp + 
    $workpro + $married;

       $recipient = "harshitt10@gmail.com"; //Add your email

        $subject = "New contact from $name";

        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Phone Number:\n$phoneno\n";
        $email_content .= "Address:\n$address\n";

        $email_content .= "Total Credit For Canada:\n$total\n";

        $email_headers = "From: $name <$email>";

        if (mail($recipient, $subject, $email_content, $email_headers)) {
            http_response_code(200);
        } else {
            http_response_code(500);
        }

  

 header("Location: /canada.php?totalcredit=$total");
exit();

}
    

?>