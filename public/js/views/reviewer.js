// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Reviewer) matches name of template file Reviewer.html
splat.Reviewer = Backbone.View.extend({

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
			//the temlate is not usable for unknown reason.

			// var reviewTemplate = _.template("current rated: <image src=<%= (this.rating >= 50.0 ) ? \"img/fresh.gif\" : \"img/rotten.gif\" %>> ");
			// this.$('.rate').append(reviewTemplate(self.model.toJSON()));
			if (this.rating >= 50.0){
				this.$('.rate').append('current rated: <image src="img/fresh.gif">');
			}
			else{
				this.$('.rate').append('current rated: <image src="img/rotten.gif">');
			}
			this.$('.rate').append(this.rating + "%" + "(" + this.freshVotes + ")");
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
				var movieId = self.model.attributes.movieId;
				self.model = new splat.ReviewModel();
				self.model.attributes.movieId = movieId;
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
