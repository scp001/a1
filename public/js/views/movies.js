// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (MovieThumb) matches name of template file MovieThumb.html
splat.MovieThumb = Backbone.View.extend({

    // render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template());
		return this;    // support method chaining
    }

});
