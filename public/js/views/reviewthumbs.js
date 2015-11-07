// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Reviewer) matches name of template file Reviewer.html
splat.ReviewThumbs = Backbone.View.extend({

	// template function for the html
	reviewsTemplate: _.template([
		"<% reviews.each(function(review) { %>",
	    "<%= reviewTemplate(reivew.toJSON()) %>",
		"<% }); %>",
    ].join('')),

    // initialize the view	
	initialize: function() {
		// initiates a request to retrieve the tempalte
		this.reviewThumbLoad = $.get('tpl/ReviewThumbs.html');
	},

	// render the View
    render: function () {
		var self = this;
		
		// if the bind is done
		this.reviewThumbLoad.done(function(markup) {
			self.template = _.template(markup);
		});

		// define the template function with variables		
		var reviewsMarkup = this.reviewsTemplate({
			reviews: this.collection, reviewTemplate: this.template,
		});
		
		// set the view element ($el) HTML content using its template
		this.$el.html("<div class='container-fluid'><br><ul>" + reviewsMarkup + "</ul></div>");

		return this;
	},


});