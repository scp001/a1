// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Reviewer) matches name of template file Reviewer.html
splat.ReviewThumbs = Backbone.View.extend({

	// render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},


});