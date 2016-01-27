// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// User
splat.UserModel = Backbone.Model.extend({

	idAttribute: "_id",

    // default value
	defaults: {
	  	username : "",  // user name
		password : "", // password
		password2 : "", // password 2
		email : ""  // email address
	},
	
	// Validation function
	validateItem: function(key, obj) {
		// if a validator is defined on this key
		// test it, else defaults to valid
		return (this.validators[key]) ? this.validators[key](this.get(key), obj) : {isValid: true};
	},
	
	// regex validation for each input
	validators : {
		// username regex
		username: function(value){
			return value.length > 0 ? {isValid: true} : {isValid: false, message: "Username cannot be empty"};
		},
		
		// password regex
		password: function(value){
			return value ? {isValid: true} : {isValid: false, message: "Password cannot be empty"};
		},
		
		password2: function(value, obj){
			return (value && value == obj.get('password')) ? {isValid: true} : {isValid: false, message: "Two passwords entered must match"};
		},
		
		// email regex
		email: function(value){
			var emailRegex =/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			return (value && emailRegex.test(value)) ? {isValid: true} : {isValid: false, message: "Email address is not valid"};
		}
	}

});