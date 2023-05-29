<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 2, 2011
 * -----------------------------------------------------------------
 * Include this file to authenticate users by redirecting unauthenticated users
 * to the intranet login page.
 * ************************************************************************** */

session_start();

if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}

?>
