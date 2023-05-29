/* Initial database connection stuff. */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/Intranet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	/* Everything that needs to be done should happen within this
	call back function. The database is open/connected and everything
	run here will happen to the database. */

	/* This is a quote container. It holds the general information about a quote.
	These are sent to customers. A customer would then choose one of the quantities. */
	var Quote = new Schema({
		Customer	: String
	  , Rates		: [Rates]
	  , JobName		: String
	  , Attention 	: String
	  , Description	: String
	  , Notes		: String
	  , Date 		: Date 
	  , Author		: String
	  , Quantities 	: [QuoteQuantity]
	  /* The quote log will contain information about the happenings of this quote. */
	  , QuoteLog 	: [{date: Date, message: String}]
	});

	/* The rates of a quote are initially loaded from the database but
	can be edited for each Quote. */
	var Rates = new Schema({
		//Press rates
		Die						: Number 
	  , Cutting					: Number
	  , Iijima					: Number //Per Hour (also used for setup)
	  , IijimaPerM				: Number //Per hour per 1000 units.
      ,	Heidelberg 				: Number //Per Hour (also used for setup)
      , HeidelbergPerM			: Number //Per hour per 1000 units.

		//Gluing rates (May replace "Gluer____" with machine name.)
	  , Gluer					: Number //Per hour (also used for setup)
	  , GluerPerM				: Number //Per hour per 1000 units.

		//Stripping rates
	  , Stripping				: Number //Per hour (also used for setup)
	  , StrippingPerM			: Number //Per hour per 1000 units.

		//Handwork
	  , Tape 					: Number
	  , TapePerM				: Number
	  , Fold					: Number
	  , FoldPerM				: Number

		//Materials (units will be per inch rounded to the nearest roll.)
	  , MaterialRates 			:[MaterialRates]

		//Shipping (Units are per skid.)
		//The first is the cost of one skid 
		//The second is the cost of every skid after the first one.
	  //By Courier
	  , PickupFirstCourier		: Number
	  , PickupSecondCourier		: Number
	  , DeliveryFirstCourier 	: Number
	  , DeliverySecondCourier 	: Number

	  //By Truck
	  , PickupFirstTruck		: Number
	  , PickupSecondTruck		: Number
	  , DeliveryFirstTruck	 	: Number
	  , DeliverySecondTruck 	: Number

		//Discounts/Surcharge
	  , Customer 				: Number //Multiplier of the quote set for the customer.
	  , Global 					: Number //Multiplier of quote set for the entire shop
	});	

	var MaterialRates = new Schema({
		//Tape is priced by cost per roll. Users can input number of rolls or 
		//number of inches and we will need to calculate based on how the roll
		//is sold. Also there will be a markup on the roll.
		Tape: [{	
				Name: String
			  , Cost: Number
			  , MarkUp: Number
			  , Value: Number
			  , InchesPerRoll: Number
			}]

	  , Fixed: [{
				Name: String
		  	  , Cost: Number //Per Unit.
		  	  , MarkUp: Number
		}]
	});

	var QuoteQuantity = new Schema ({

		//General
		Quantity 			: Number
	  , UnitsPerSheet		: Number
	  , NumberOfSheets		: Number

		//Press
	  , PressSetup			: Number
	  , PressRunSpeed 		: Number
	  , Stock				: String

		//Gluing
	  , GluingSetup 		: Number
	  , GluingRunSpeed		: Number

		//Stripping
	  , StrippingRunSpeed 	: Number

		//Handwork
	  , TapeRunSpeed		: Number
	  , FoldRunSpeed		: Number

		//Shipping
	  , PackagingPerM		: Number
	  , ShippingMethod		: String
	  , Pickup 				: Number
	  , Delivery 			: Number

		//Totals
	  , Subtotal			: Number
	  , Surcharge			: Number
	  , Total 				: Number
	  , TotalPerM			: Number

		//Notes
	  , PrivateNotes 		: String
	  , PublicNotes 		: String

	});


mongoose.model('Quote', Quote);

//Create a collection "masterrates" that follows the Rates schema
var Rate = mongoose.model('MasterRates', Rates);
var MasterRates = new Rate({
	Die: 1,
	Cutting: 1
});
MasterRates.save();


var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

});