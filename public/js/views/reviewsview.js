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
		
		// render Reviewer subview
		this.formView = new splat.MovieForm({model: this.model});
		this.$('#movieform').append(this.formView.render().el);

		// render ReviewThumbs subview
		this.imgView = new splat.MovieImg({model: this.model});
		this.$('#movieimg').append(this.imgView.render().el);

		return this;
    },

    // remove subviews on close of Details view
    onClose: function() {
        if (this.formView) { this.formView.remove(); }
        if (this.imgView) { this.imgView.remove(); }
    },


});
