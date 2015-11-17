// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note collection for user model
splat.Users = Backbone.Collection.extend({

    // identify collections model
    model: splat.UserModel,
    
    // move local storage to server
	url: '/auth',

});