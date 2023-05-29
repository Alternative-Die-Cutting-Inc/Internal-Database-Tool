/* ShopRates is a controller. It runs this function to load the stuff within
the scope of ng-controller=ShopRates on index.php */function ShopRates(e,t){t.post("php/QT_helper.php",{data:{request:"get_table_row",table:"QT_MasterRates"}}).success(function(t,n){e.status=n;e.data=t;e.rates=t}).error(function(t,n){console.log("Post failed.");e.data=t||"Request failed";e.status=n});t.post("php/QT_helper.php",{data:{request:"get_table",table:"QT_Press"}}).success(function(t,n){e.status=n;e.data=t;e.press_rates=t}).error(function(t,n){console.log("Post failed.");e.data=t||"Request failed";e.status=n});t.post("php/QT_helper.php",{data:{request:"get_table",table:"QT_Gluer"}}).success(function(t,n){e.status=n;e.data=t;e.gluer_rates=t}).error(function(t,n){console.log("Post failed.");e.data=t||"Request failed";e.status=n})}function QuoteController(e){e.quoteNumber;e.quoteQuantities={};e.presses=[];e.quantityRates={};e.stocks={};e.gluers=[];e.createQuote=function(){$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"create_quote",quote_number:e.quoteNumber,customer:this.customer,job_name:this.job_name,description:this.description,notes:this.notes,author:this.author,attention:this.attention},success:function(t,n){e.quoteQuantities[t.quantity_id]=t;e.getQuantityRates();e.$apply()},error:function(e,t){console.log(e.responseText)}})};$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_max_quote"},success:function(t,n){e.quoteNumber=t+1}});$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_table_visible",table:"QT_Press"},success:function(t,n){for(var r in t)e.presses.push(t[r])}});$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_table_visible",table:"QT_Gluer"},success:function(t,n){for(var r in t)e.gluers.push(t[r])}});$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_table_visible",table:"QT_Stock"},success:function(t,n){e.stocks=t}});e.getQuantityRates=function(){$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_rates",quote_number:e.quoteNumber},success:function(t,n){e.quantityRates=t;console.log(e.quantityRates)}})};e.createQuantity=function(){$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"create_quantity",quote_number:e.quoteNumber},success:function(t,n){e.quoteQuantities[t.quantity_id]=t;console.log(e.quoteQuantities);e.getQuantityRates();e.$apply()},error:function(e,t){console.log(e.responseText)}})};e.pressChange=function(t){var n=this.selectedPress;QT.updateQuoteQuantityValue(e.quoteNumber,t,"press_id",n);e.quoteQuantities[t].press_id=n;var r=$.grep(e.presses,function(e){return e.press_id==n})[0].rate;e.quantityRates[t].press_per_hour=r;QT.updateQuantityRateValue(e.quoteNumber,t,"press_per_hour",r);e.calculateTotal(t)};e.gluerChange=function(t){var n=this.selectedGluer;QT.updateQuoteQuantityValue(e.quoteNumber,t,"gluer_id",n);e.quoteQuantities[t].gluer_id=n;var r=$.grep(e.gluers,function(e){return e.gluer_id==n})[0].rate;e.quantityRates[t].gluer_per_hour=r;QT.updateQuantityRateValue(e.quoteNumber,t,"gluer_per_hour",r);e.calculateTotal(t)};e.isSelectedPress=function(t,n){return e.quoteQuantities[t]["press_id"]==n?"selected":"not selected"};e.isSelectedStock=function(t,n){return e.quoteQuantities[t]["stock_id"]==n?"selected":"not selected"};e.isSelectedGluer=function(t,n){return e.quoteQuantities[t]["gluer_id"]==n?"selected":"not selected"};e.stockChange=function(t){var n=this.selectedStock;QT.updateQuoteQuantityValue(e.quoteNumber,t,"stock_id",n);e.calculateTotal(t)};e.calculateTotal=function(t){var n=[],r=["die_total","cutter_total","press_setup_total","press_runspeed_total","gluer_setup_total","gluer_runspeed_total","strip_runspeed_total","tape_runspeed_total","fold_runspeed_total","package_total","pickup_skids_total","delivery_skids_total"],s=0;for(i in r)s+=parseInt(e.quoteQuantities[t][r[i]]);n.push({col:"subtotal",val:s});var o=e.quantityRates[t].customer_premium,u=e.quantityRates[t].global_premium,a=s*o*u;n.push({col:"total",val:a});var f=a-s;n.push({col:"premium",val:f});var l=e.quoteQuantities[t].units;if(l==0)var c=0;else var c=a/(l/1e3);n.push({col:"total_per_m",val:c});e.saveValues(n,t)};e.saveValues=function(t,n){for(var r=0;r<t.length;r++){e.quoteQuantities[n][t[r].col]=t[r].val;QT.updateQuoteQuantityValue(e.quoteNumber,n,t[r].col,t[r].val)}};e.recalculateTotalWithPerM=function(t,n){var r;switch(n){case"fold":case"tape":r=e.quantityRates[t].handwork_per_hour;break;default:r=e.quantityRates[t][n+"_per_hour"];console.log("rate for "+n+" is "+r)}if(r!=null){var i=e.quoteQuantities[t].units;if(i==0)var s=0,o=0;else var s=QT.inDollars(r*e.quoteQuantities[t][n+"_runspeed"]),o=QT.inDollars(s/(i/1e3));console.log([{col:n+"_per_m",val:o},{col:n+"_runspeed_total",val:s}]);e.saveValues([{col:n+"_per_m",val:o},{col:n+"_runspeed_total",val:s}],t)}};e.recalculateTotal=function(t,n){var r=e.quoteQuantities[t][n],i=n+"_total";switch(n){case"package_per_m_units":var s=e.quoteQuantities[t].units/1e3,i="package_total";console.log(s);break;case"die":case"cutter":case"press_setup":var s=e.quantityRates[t].press_per_hour;break;case"gluer_setup":var s=e.quantityRates[t].gluer_per_hour;break;default:}if(s!=null){var o=QT.inDollars(s*r);e.saveValues([{col:i,val:o}],t)}}}function range(e,t,n){if(typeof t=="undefined"){t=e;e=0}typeof n=="undefined"&&(n=1);var r=[];for(var i=e;n>0?i<t:i>t;i+=n)r.push(i);return r}QT={};QT.init=function(e){var t=[];$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"get_customers"},success:function(e,n){t=e},error:function(e,t){}});$("#customers").keyup(function(){var e=this.value;$("#customers").autocomplete({source:t})})};QT.cache=function(){QT.dom={};QT.constants={}};$(document).ready(function(e){QT.init(e)});QT.setMasterRate=function(e,t,n,r){r.post("php/QT_helper.php",{data:{request:"set_master_rate",rate:e,name:t,table:n}}).success(function(e,t){console.log(e)}).error(function(e,t){console.log("Post failed.")})};QT.updateQuoteQuantityValue=function(e,t,n,r){$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"update_quote_quantity",quote_number:e,quantity_id:t,column:n,value:r},success:function(e,t){console.log(e)},error:function(e,t){}})};QT.updateQuantityRateValue=function(e,t,n,r){$.ajax({url:"php/QT_helper.php",type:"POST",dataType:"json",data:{request:"update_quantity_rate",quote_number:e,quantity_id:t,column:n,value:r},success:function(e,t){console.log(e)},error:function(e,t){}})};QT.inDollars=function(e){return Math.floor(e*100)/100};