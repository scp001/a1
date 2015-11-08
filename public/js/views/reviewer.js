// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Reviewer) matches name of template file Reviewer.html
splat.Reviewer = Backbone.View.extend({

	// render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));
		
		var reviewRateView = new splat.ReviewRate({collection: this.collection});
		this.$('.rate').append(reviewRateView.render().el);

		return this;
	},

	events: {
		"click #reviewsave" : "addReviewHandler",
		"change .reviewform" : "change",
	},

	// addReview handler event
	addReviewHandler: function() {
		var newModel = this.collection.create(this.model, {
			wait: true,  // don't create client model until server responds
			success: function(response) {
				// notification panel, defined in section 2.6
				splat.app.navigate('#movies/:id/reviews', {replace:true, trigger:true});
				splat.utils.showNotice('Success', "Review added", 'alert-success');
				splat.utils.hideNotice();
			},
			error: function(response) {
				// display the error response from the server
				splat.utils.showNotice('Fail', "Review was not sucessfully added", 'alert-danger');
				splat.utils.hideNotice();
			},
		});
	},
	
	// change event for reviewform
	change: function (event) {
		// object to hold form-field name:value pairs
		var changeObj = {};

		// Add change value to changeObj; change event is
		// triggered once for each changed field value
		changeObj[event.target.name] = event.target.value;
		this.model.set(changeObj);
		
    },
});
