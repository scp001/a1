// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note Model for movie
splat.ReviewModel = Backbone.Model.extend({

	idAttribute: "_id",

    // default value
	defaults: {
	  	freshness : 0.0,  // fresh review value 1.0, rotten value 0.0
		reviewName : "", // name of reviewer
		reviewAffil : "",  // affiliation of reviewer
		reviewText : "",  // review comments
		movieId : ""  // id of reviewed movie
	}

});
