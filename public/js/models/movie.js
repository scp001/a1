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

});
