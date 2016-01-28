// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (MovieThumb) matches name of template file MovieThumb.html
splat.MovieThumb = Backbone.View.extend({
	
	// template function for the html
	moviesTemplate: _.template([
		"<% movies.each(function(movie) { %>",
	    "<%= movieTemplate(movie.toJSON()) %>",
		"<% }); %>"
    ].join('')),

	// initialize the view	
	initialize: function() {
		// initiates a request to retrieve the tempalte
		this.movieThumbLoad = $.get('tpl/MovieThumb.html');
		this.listenTo(Backbone, 'orderevent', this.render);
	},

    // render the View
    render: function () {
	
		// comparator function on collection is the basis for comparing movie
		// models
		this.collection.comparator = function(movie) {
            return movie.get(splat.order);
        };
		// sort collection before rendering it - implicitly uses comparator
		
        this.collection.sort();
		var self = this;
		
		// if the bind is done
		this.movieThumbLoad.done(function(markup) {
			self.template = _.template(markup);
		});

		// define the template function with variables		
		var moviesMarkup = this.moviesTemplate({
			movies: this.collection, movieTemplate: this.template
		});
		
		// set the view element ($el) HTML content using its template
		this.$el.html("<div class='container-fluid'><br><ul>" + moviesMarkup + "</ul></div>");
		return this;    // support method chaining
    }

});
