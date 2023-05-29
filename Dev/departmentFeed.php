<?php ?>
<html>
    <head>
        <style>
            .statusButton {
                /*                float: right;*/
                height: 250px;
                width: 100%;
                font-size: 200px;
            }
            table {
                width: 100%;
            }
            form input {
                /*                font-size: 100px;*/
                /*                height: 30px;*/
            }
            .docketNumber {
                font-size: 200px;
            }

            hr {
                height: 30px;
                background-color: #000000;
            }
            table.ex1 {
                table-layout:fixed;
                cellspacing:0;
            }

            td.DieMaking{
                border: 2px solid #CC0033;
            }
            td.DieMakingComplete{
                background-color: #CC0033;
                border: 2px solid #CC0033;
            }
            td.Press{
                border: 2px solid #FF9900;
            }
            td.PressComplete {
                background-color: #FF9900;
                border: 2px solid #FF9900;
            }
            td.Stripping {
                border: 2px solid #FFFF00;
            }
            td.StrippingComplete {
                background-color: #FFFF00;
                border: 2px solid #FFFF00;
            }
            td.Gluing{
                border: 2px solid #009900;
            }
            td.GluingComplete {
                background-color: #009900;
                border: 2px solid #009900;
            }
            td.HandWork{
                border: 2px solid #003399;
            }
            td.HandWorkComplete {
                background-color: #003399;
                border: 2px solid #003399;
            }

        </style>
    </head>
    <body>

        Nothing Started:
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="DieMaking">Die Making</td>
                <td class="Press">Press</td>
                <td class="Stripping">Stripping</td>
                <td class="Gluing">Gluing</td>
                <td class="HandWork">Hand Work</td>
            </tr>
        </table>
        <br />
        <br />
        Die Making Complete
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="DieMakingComplete"></td>
                <td class="Press"></td>
                <td class="Stripping"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>
        <br />
        <br />
        Press Started
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="PressComplete"></td>
                <td class="Press"></td>
                <td class="Stripping"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>

        <br /><br /><br />Press Complete
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="PressComplete"></td>
                <td class="PressComplete"></td>
                <td class="Stripping"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>

        <br />
        <br /><br />Stripping Started

        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="StrippingComplete"></td>
                <td class="StrippingComplete"></td>
                <td class="Stripping"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>
        <br />
        <br /><br />Stripping Complete

        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="StrippingComplete"></td>
                <td class="StrippingComplete"></td>
                <td class="StrippingComplete"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>

        <br />
        <br /><br /> Gluing Starting

        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="GluingComplete"></td>
                <td class="GluingComplete"></td>
                <td class="GluingComplete"></td>
                <td class="Gluing"></td>
                <td class="HandWork"></td>
            </tr>
        </table>
        <br />
        <br /><br /> Gluing Complete

        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="GluingComplete"></td>
                <td class="GluingComplete"></td>
                <td class="GluingComplete"></td>
                <td class="GluingComplete"></td>
                <td class="HandWork"></td>
            </tr>
        </table>

        <br />
        <br /><br />Hand Work Started
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWork"></td>
            </tr>
        </table>
        <br />
        <br /><br />Hand Work Complete
        <table class="ex1" width="100%" cellspacing="0">
            <tr>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
                <td class="HandWorkComplete"></td>
            </tr>
        </table>


    <center>
        <hr></hr>
        <span class="docketNumber">#23876</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
        <hr></hr>
        <span class="docketNumber">#23108</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
        <hr></hr>
        <span class="docketNumber">#24080</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
        <hr></hr>
        <span class="docketNumber">#21234</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
        <hr></hr>
        <span class="docketNumber">#20234</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
        <hr></hr>
        <span class="docketNumber">#23890</span>
        <button class="statusButton" type="submit" name="status" value="instock">START</button>
    </center>
</body>
</html>