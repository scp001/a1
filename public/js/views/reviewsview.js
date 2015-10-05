// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Review) matches name of template file Reviews.html
splat.Review = Backbone.View.extend({

    // render the View
    render: function () {

		// set the view element ($el) HTML content using its template
		this.$el.html(this.tempalte);
		return this;    // support method chaining
    }

});
