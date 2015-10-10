// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Review) matches name of template file Reviews.html
splat.Review = Backbone.View.extend({

    // render the View
    render: function () {

		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));
		
		var self = this;
		// instantiate a MovieForm subview and append its markup to designated tag in self
		$.get('tpl/Reviewer.html', function(data){
			var template = _.template(data);
			self.$('#reviewer').append(template(self.model.toJSON()));
		});	

    }

});
