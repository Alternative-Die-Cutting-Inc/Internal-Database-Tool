<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Testing of extra charges</title>

        <!-- link to JQuery -->
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>

        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/ShippingTool/Scripts/forms.js"></script>
        <!-- let's use the renderer from Dev instead -->
        <script type="text/javascript" src="xmlRender.js"></script>

        <script type="text/javascript">
            function fetchExtraCharges() {
                $.ajax({
                    url: "loadExtraCharges.php",
                    dataType: "xml",
                    type: "post",
                    data: {
                        type: "load",
                        DocketNumber: 0
                    },
                    success: function(xml) {
                        var numForms = $(xml).find("row").length;
                        
                        //remove everything and reset variables
                        $("#extraChargeContainer").find(".removeAllButton").click();
                        
                        //prepare the container for influx of forms
                        while(numForms > 0) {
                            $("#extraChargeContainer").find(".addButton").click();
                            numForms--;
                        }
                        
                        Render.renderRows(xml, "c");
                        
                        //now update the charges
                        sumCharges();
                    },
                    error: function() {
                        console.log("Request failed");
                    }
                });
            }
            
            /**
             * Add events to the extra charge buttons.
             */
            function addExtraChargeEvents () {
                $("#extraChargeContainer").find(".addButton").click(function() {
                    var row = $("#extraChargeContainer").get(0).addForm();
                    
                    if(row !== false && $(row).length > 0) {
                        $(row).find(".removeButton").click(function() {
                            sumCharges();
                        });
                        
                        $(row).find(".chargeAmt").change(function() {
                            sumCharges();
                        });
                    }
                });
                
                $("#extraChargeContainer").find(".removeAllButton").click(function() {
                    $("#extraChargeContainer").get(0).removeAllForms();
                });
            }
            
            /**
             * Extend the extra charge container with the formContainer object
             * and set all necessary variables.
             */
            function prepExtraChargeContainer() {
                var cont = $("#extraChargeContainer").get(0);
                $.extend(cont, FormContainer);
                cont.SELECTOR = "#extraChargeContainer";
                cont.TABLE_SELECTOR = "#extraChargesTable";
                cont.INVISIBLE_SELECTOR = "#noCharge";
                cont.ROW_CLASS = "c";
            }
            
            function sumCharges() {
                var total = 0;
                var val;
                
                $("#extraChargeContainer").find(".chargeAmt").each(function() {
                    var val = $(this).val().toString().replace("$", "").toFloat();
                    total += val;
                });
                
                $("#extraChargeContainer").find("#totalExtraCharges").val("$" + total.toFixed(2));
                
                console.log("Total: " + total);
            }
            
            $(document).ready(function() {
                //hide the prototypes (typically done elsewhere)
                $(".prototype").hide();
                
                prepExtraChargeContainer();
                addExtraChargeEvents();
            });
    
        
        </script>
    </head>
    <body>
        <button type="button" onclick="fetchExtraCharges()">Fetch</button>

        <div id="extraChargeContainer" class="contentContainer">
            <hr />

            <div class="controlPanel">
                <label for="totalExtraCharges">Total Extra Charges:</label>
                <input type="text" name="totalExtra" id="totalExtraCharges" />

                <button type="button" class="addButton">Add Charge</button>
                <button type="button" class="removeAllButton">Remove All</button>
            </div> <!-- end control panel -->

            <hr />

            <div id="noCharge">
                <h3>No extra charges to display</h3>
            </div>

            <table id="extraChargesTable" style="display: none;">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Notes</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="chargesRow prototype">
                        <td><input type="text" class="Form chargeName" name="chargeName[]" /></td>
                        <td><input type="text" class="Form chargeAmt" name="chargeAmt[]" /></td>
                        <td><input type="text" class="Form chargeNotes" name="chargeNotes[]" /></td>
                        <td>
                            <span class="removeChargeButton">
                                <img src="/Intranet/Resources/Images/delete-icon.png" class="removeButton" alt="X" height="20" width="20" />
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> <!-- end extra charge container -->


    </body>
</html>
