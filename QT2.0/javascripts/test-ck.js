function ShopRates(e){e.rates=[{name:"Global Rate",value:1},{name:"Customer Rate",value:2},{name:"Die",value:1},{name:"Cutter",value:1},{name:"Press Setup",value:1},{name:"Press Run - Per Iijima/Heidelberg",value:1},{name:"Gluer Setup",value:1},{name:"Gluer Run",value:1},{name:"Stripping",value:1},{name:"Tape",value:1},{name:"Fold",value:1}]}function QuoteController(e){e.number=12;e.getNumber=function(){return 234}}$(document).ready(function(){$("#infoModal").reveal();$("#customers").focus()});$(function(){var e=["Main","Main 2","Main 3","Colour Innovation","KPG Graphics","Transcontinental"];$("#customers").keyup(function(){var t=this.value;$("#customers").autocomplete({source:e})})});