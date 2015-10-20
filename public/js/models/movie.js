// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note model for movie
splat.MovieModel = Backbone.Model.extend({
	idAttribute: "_id", //model id in server side
	
    // default value
	defaults: {
	  title: "",  // movie title
      released: null,  // release year
      director: "",  // movie's director
      starring: [],  // array principal actors
      rating: "",  // MPAA movie rating: G, PG, PG-13, R, NC-17, NR
      duration: null,   // run-time in minutes
      genre: [],   // genre terms, e.g. action, comedy, etc
      synopsis: "",  // brief outline of the movie
      freshTotal: 0.0,   // cumulative total of review fresh (1.0) votes
      freshVotes: 0.0,   // number of review ratings
      trailer: null,  // URL for trailer/movie-streaming
      poster: "img/placeholder.png",  // movie-poster image URL
      dated: new Date(),  // date of movie posting
	},
		
	trailer: "https://archive.org/details/movies", // trailer URL

	validators : {
		title: function(value){
			var titleRegex = /^[a-zA-Z0-9 \,\.\!\?\-\'\*]+$/;
			return (value.length > 0 && titleRegex.test(value)) ? {isValid: true} : {isValid: false, message: "Only 1 or more letters-digits-spaces allowed"};
		},
		
		released: function(value){
			var releasedRegex = /^(19[1-9][0-9]|200[0-9]|201[0-6])$/;
			return (value.length > 0 && releasedRegex.test(value)) ? {isValid: true} : {isValid: false, message: "Release Date must be between 1910 and 2016"};
		},
		
		director: function(value){
			var directorRegex = /^[a-zA-Z0-9 \,\.\!\?\-\'\*]+$/;
			return (value.length > 0 && directorRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a director's name"};
		},
		
		starring: function(value){
			var starringRegex = /^(([a-zA-Z \-\']+),?)+$/;
			return (value.length > 0 && starringRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter names"};
		},
		
		genre: function(value){
			var genreRegex = /^(([a-zA-Z \-\']+),?)+$/;
			return (value.length > 0 && genreRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter string patterns"};
		},
		
		duration: function(value){
			var durationRegex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$/;
			return (value.length > 0 && durationRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter 0-999"};
		},
		
		synopsis: function(value){
			var synopsisRegex = /^[\w ]+$/;
			return (value.length > 0 && synopsisRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a non-empty word list"};
		},
		
		trailer: function(value){
			var trailerRegex = /(^$|^(http|https):\/\/www\.[a-zA-Z0-9]+\.com$)/;
			return (value.length > 0 && trailerRegex.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a valid url"};
		},
	},

	// Validation function
	validateItem: function(key) {
		// if a validator is defined on this key
		// test it, else defaults to valid
		return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
	},

});
