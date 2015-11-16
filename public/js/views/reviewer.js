// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Reviewer) matches name of template file Reviewer.html
splat.Reviewer = Backbone.View.extend({

	// get movie collection from parent view
	initialize: function(option) {
		this.movie = option.movies.get(this.model.attributes.movieId);
		this.freshTotal = this.movie.attributes.freshTotal;
		this.freshVotes = this.movie.attributes.freshVotes;
		this.rating = Math.floor(this.freshTotal/this.freshVotes*1000)/10;

	},

	// render the View
    render: function () {
    	var self = this;
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(self.model.toJSON()));

		if (this.freshVotes == 0.0){
				var reviewTemplate = _.template("... no reviews yet");
				this.$('.rate').append(reviewTemplate(self.model.toJSON()));
		}else{
			// if rating is greater that 50% show fresh
			if (this.rating >= 50.0){
				this.$('.rate').append('currently rated: <image src="img/fresh.gif">');
			}
			else{
				this.$('.rate').append('current rated: <image src="img/rotten.gif">');
			}
			this.$('.rate').append(" " + this.rating + "%" + "(" + this.freshVotes + ")");
		}

		return this;


	},

	events: {
		"click #reviewsave" : "addReviewHandler",
		"change .reviewform" : "change",
	},

	// addReview handler event
	addReviewHandler: function() {
		var self = this;
		var newModel = this.collection.create(this.model, {
			wait: true,  // don't create client model until server responds
			success: function(response) {
				// notification panel, defined in section 2.6
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
		changeObj[event.target.name] = _.escape(event.target.value);
		this.model.set(changeObj);

    },
});
