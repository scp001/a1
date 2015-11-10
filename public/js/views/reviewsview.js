// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Review) matches name of template file Reviews.html
splat.ReviewsView = Backbone.View.extend({

	initialize: function(options) {
		this.movie = options.movie;

		// invoke showScore and renderReviews methods when collection is sync'd
		this.listenTo(this.collection, "sync", this.showScore);
		this.listenTo(this.collection, "sync", this.renderReviews);
	},

    // render the View
    render: function () {
		console.log(this.movie);
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));

		// render Reviewer subview
		this.reviewerView = new splat.Reviewer({model: this.model, collection: this.collection, movie: this.movie});
		this.$('#reviewer').append(this.reviewerView.render().el);

		// render ReviewThumbs subview
		this.reviewThumbsView = new splat.ReviewThumbs({model: this.model, collection: this.collection});
		this.$('#reviewthumbs').append(this.reviewThumbsView.render().el);

		return this;
    },

	showScore: function () {

		//}else{
			//	display movie.attributes.freshTotal/movie.attributes.freshVotes
		//}
	},

	renderReviews: function () {

		alert("hehe");
		console.log(this.movie.attributes.freshVotes);
		if (this.movie.attributes.freshVotes == 0){
			var reviewTemplate = _.template("... no reviews yet");
			this.$('.rate').append(reviewTemplate(self.model.toJSON()));
		}
		else{
			this.$('.rate').empty()
			if (!this.movieCollection){
			this.movieCollection = new splat.Movies();
			}

			var moviesFetch = this.movieCollection.fetch();
			var self = this;

			moviesFetch.done(function(collection, response){
				console.log(self.movieCollection);
				}).fail(function(collection, response){
				splat.utils.showNotice("Error", "Cannot connect to storage", "alert-danger");
				splat.utils.hideNotice();
			})
		}



			// if ((Math.floor(this.movie.attributes.freshTotal/this.movie.attributes.freshVotes*1000)/10) >= 50.0){
			// 	this.$('.rate').append('current rated: <image src="img/fresh.gif">');
			// }
			// else{
			// 	this.$('.rate').append('current rated: <image src="img/rotten.gif">');
			// }
			// this.$('.rate').append(Math.floor(this.movie.attributes.freshTotal/this.movie.attributes.freshVotes*1000)/10 + "%");
	},

    // remove subviews on close of Details view
    onClose: function() {
        if (this.reviewerView) { this.reviewerView.remove(); }
        if (this.reviewThumbsView) { this.reviewThumbsView.remove(); }
    },
});
