<ul class="title-area"><!-- Title Area -->
    <li class="name">
        <h1>
            <!-- Phone Book link removed -->
        </h1>
    </li><!-- Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone -->
    <li class="toggle-topbar menu-icon">
        <a href="#">
            <span>Menu</span>
        </a>
    </li>
</ul>
<section class="top-bar-section"><!-- Left Nav Section -->
    <ul class="left">
        <li class="divider"></li>
        <li class="active">
            <a href='/Intranet/HomePage/DocketLogin.php'>Docket Login</a>
        </li>
        <li class="divider"></li>
        <!-- Old Links removed -->
        <li class="divider"></li>
        <!-- New Quote removed -->
        <li class="divider"></li>
        <li class="">
            <a href='/Intranet/QT/'>[QuoteTool 2.0]</a>
        </li>
        <li class="divider"></li>
        <li><a href="/Intranet/Analytics/monthly.php">Analytics</a></li>
        <li class="divider"></li>
        <li><a href="/Intranet/Logs/index.php">Logs</a></li>
        <li class="divider"></li>
    </ul>
    <ul class="right">
        <li class="divider"></li>
        <li>
            <a href="#">
                {{user.name}}
            </a>
        </li>
        <li class="divider"></li>
        <li>
            <a href="#">{{user.email}}</a>
        </li>
        <li class="divider"></li>
        <li>
            <a href="/Intranet/logout.php">Logout</a>
        </li>
    </ul>
</section>


