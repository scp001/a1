// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Review) matches name of template file Reviews.html
splat.ReviewsView = Backbone.View.extend({

    // render the View
    render: function () {

		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));

		// render Reviewer subview
		this.reviewerView = new splat.Reviewer({model: this.model});
		this.$('#reviewer').append(this.reviewerView.render().el);

		// render ReviewThumbs subview
		this.reviewThumbsView = new splat.ReviewThumbs({model: this.model});
		this.$('#reviewthumbs').append(this.reviewThumbsView.render().el);

		return this;
    },

    // remove subviews on close of Details view
    onClose: function() {
        if (this.reviewerView) { this.formView.remove(); }
        if (this.reviewThumbsView) { this.imgView.remove(); }
    },

    events: {
		"click #moviesave" : "addReviewHandler"
	},

	// add handler event
	addReviewHandler: function() {

	},
});
