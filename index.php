<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

require __DIR__ . '/Resources/Backend/loginHelper.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    login($_POST['username'], $_POST['password']);
}

if (isset($_SESSION['valid']) && $_SESSION['valid'] === true) {
    header("Location: /Intranet/HomePage/");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Menu</title>
    <link href="login.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/png" href="Resources/Images/penguin_1.png">
    <!--JQuery hosted by google-->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
</head>
<body>
    <div id="wrapper">
         <div id="banner">
                <h1>Welcome to the Alternative Die Cutting Intranet</h1>
               
                

        <div id="loginPane">
            <span id="logo">
                <img src="Resources/Images/alt_logo.gif" width="150" height="100">
            </span>

            <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
                <table>
                    <tr>
                        <td>Login</td>
                        <td><input type="text" name="username"></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                      <td><input type="password" name="password" /></td>
                        </tr>
                        <tr>
                            <td> <!-- empty, used for formatting --> </td>
                            <td><input type="submit" name="Submit" value="Login" /></td>
                        </tr>
                    </table>
                </form>
            </div> <!-- end loginPane -->

            <div id="loginError" style="<?php
        echo isset($_SESSION['valid']) && $_SESSION['valid'] === false ? "display: block;" : "display: none;";
        ?>">

                <h2>
                    <?php
                    if (isset($_SESSION['error']))
                        echo $_SESSION['error'];
                    else
                        echo "Unknown error";
                    ?>
                </h2>
            </div>
        </div>
        </div> <!-- end wrapper -->
    </body>
</html>
