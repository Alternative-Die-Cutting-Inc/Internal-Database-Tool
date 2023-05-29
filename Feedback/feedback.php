<?php
/* * ***************************************************************************
 * This is the popup feedback page. Send an email to the sysadmin, developer
 * with the feedback, and certain other usage info.
 * ---------------------------------------------------------------------------
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on July 11, 2011
 * 
 * ************************************************************************** */

session_start();
$submission = false;

/**
 *
 * @param string $sourcePage The page from which the feedback is coming from.
 * @param string $name The name of the person sending the feedback.
 * @param string $comment The comment left in the feedback pane.
 * @return boolean True if feedback was sent, false otherwise.
 */
function sendMail($sourcePage, $name, $comment) {
    $to = "info@alternativedc.com";
    $subject = "Feedback from $sourcePage";
    $body = "$name wrote: \r\n" . $comment;

    mail($to, $subject, $body);
    return true;
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Feedback</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <link rel="stylesheet" type="text/css" href="feedback.css" />
    </head>
    <body>
        <div id="content">
            <h2 class="bar">Thank you for leaving feedback!</h2>
            <h3>You're awesome. Tell your friends.</h3>
            <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                <textarea id="commentPane" name="comments"></textarea>


                <br />
                <input type="hidden" name="src" value="<?php echo isset($_GET['src']) ? $_GET['src'] : "Unknown Page"; ?>" />
                <input type="submit" name="submit" value="Done" />
            </form>



            <?php
            $src = isset($_POST['src']) ? $_POST['src'] : "Unknown Page";

            if (isset($_POST['submit']) && isset($_POST['comments']) &&
                    $_POST['comments'] !== "") {
                $name = isset($_SESSION['name']) ? $_SESSION['name'] : "Anonymous";

                
                $submission = sendMail($src, $name, $_POST['comments']);
            } else {
                $submission = false;
            }
            ?>

            <div id="confirmation" style="<?php echo isset($_POST['submit']) && $submission === true ? "display: block;" : "display: none;"; ?>" >
                <h3 class="confirm">Message sent</h3>
            </div>

            <div id="error" style="<?php echo isset($_POST['submit']) && $submission === false ? "display: block;" : "display: none;"; ?>">
                <h3 class="error">That's not a valid message...</h3>
            </div>
        </div>
    </body>
</html>
