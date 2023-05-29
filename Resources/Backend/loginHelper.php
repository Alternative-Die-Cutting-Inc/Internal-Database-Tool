<?php
function connectToDatabase() {
    $link = mysqli_connect("localhost", "", "", "");
    if (!$link) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $link;
}

function cleanInput($link, $input) {
    $input = mysqli_real_escape_string($link, $input);
    return $input;
}

function disconnect($link) {
    mysqli_close($link);
}

function login($user, $password) {
    if (isset($_SESSION['valid']) && $_SESSION['valid'] === true) {
        return;
    }

    //clear all session variables
    $_SESSION = array();

    $link = connectToDatabase();
    if (!$link) {
        $_SESSION['error'] = "Unable to connect to Cheeswize.";
        $_SESSION['valid'] = false;
        return;
    }

    //clean the input
    $user = cleanInput($link, $user);
    $password = cleanInput($link, $password);

    $query = "SELECT * FROM InterUsers
        WHERE UserName='$user'
        AND Password='$password' AND Active=1";

    $result = mysqli_query($link, $query);
    if ($result) {
        if (mysqli_num_rows($result) === 1) {
            $row = mysqli_fetch_array($result);

            $_SESSION['valid'] = true;
            $_SESSION['name'] = $row['Name'];
            $_SESSION['userId'] = $row['Id'];
            $_SESSION['email'] = $row['email'];
            unset($_SESSION['error']);
        } else {
            $_SESSION['error'] = "The user name or password you have entered is invalid. Please try again.";
            $_SESSION['valid'] = false;
        }
    } else {
        $_SESSION['error'] = "Invalid SQL Query " . $query;
        $_SESSION['valid'] = false;
    }

    disconnect($link);
}
?>
