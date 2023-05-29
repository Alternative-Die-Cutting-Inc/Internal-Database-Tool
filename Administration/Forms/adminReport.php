<?php
/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 18,2011
 * *****************************************************************************
 * The print-friendly version of the report for the current month.
 * ************************************************************************** */

require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Forms/formHelper.php";
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Administrative Report for <?php echo date("F"); ?></title>

        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Forms/forms.css" />
    </head>
    <body>
        <div id="wrapper">

            <div id="banner">
                <h1>Administrative Report for <?php echo date("F"); ?></h1>
            </div>

            <div id="contentPane">
                <?php
                $fields = array("Docket Number", "Date Opened", "Customer", "Job Name", "Price");
                $numForms = 0;

                $var = format_string("Docket Number");
                if (isset($_POST[$var]) && is_array($_POST[$var])) {
                    $numForms = count($_POST[$var]);
                }
                ?>

                <table style="<?php echo $numForms === 0 ? "display: none;" : ""; ?>">
                    <thead>
                        <tr>
                            <?php
                            foreach ($fields as $name) {
                                echo "<th>{$name}</th>";
                            }
                            ?>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            for ($form = 0; $form < $numForms; $form++) {
                                echo "<tr>";

                                foreach ($fields as $name) {
                                    $val = "error - not set";
                                    $var = format_string($name);

                                    if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$form])) {
                                        $val = $_POST[$var][$form];
                                    }

                                    echo "<td>{$val}</td>";
                                }

                                echo "</tr>";
                            }
                        ?>
                    </tbody>
                </table>


            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
