// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (MovieThumb) matches name of template file MovieThumb.html
splat.MovieThumb = Backbone.View.extend({
	
	moviesTemplate: _.template([
		"<% movies.each(function(movie) { %>",
	    "<%= movieTemplate(movie.toJSON()) %>",
		"<% }); %>",
    ].join('')),
	
	initialize: function() {
		// initiates a request to retrieve the tempalte
		this.movieThumbLoad = $.get('tpl/MovieThumb.html');
	},

    // render the View
    render: function () {
		var markup;
		this.movieThumbLoad.done(function(markup) {
		// Now "markup" contains the response to the $.get() request.
		// Turn this markup into a function using Underscore's
		// template() // function.
		// Finally apply the moviesTemplate shown below to your
		// movies collection and the template function you just created.
			
		});
		
		var self = this;
		markup = this.moviesTemplate({
			movies: self.collection, movieTemplate: self.template,
		});
		
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(markup));
		return this;    // support method chaining
    }

});
