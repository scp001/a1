// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Header) matches name of template file Header.html
splat.Header = Backbone.View.extend({
	
	events: {
		"change .sortMenu" : "change",
	},

    // render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template());
		return this;    // support method chaining
    },
	
	// set menu item active
	selectMenuItem: function (menuItem){
		// clear active status by default
		$(".nav li").removeClass('active');
		// set input menuItem to active
		if(menuItem){
			$('.'+menuItem).addClass('active');
		}
	},
	
	change: function(event){
		if(event.target.value == 1){
			// Title
		}else {
			// Director
		}
	}

});
