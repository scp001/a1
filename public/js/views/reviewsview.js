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
		// var movie = this.movies.get(this.model.attributes.movieId);
		// if (movie.attributes.freshVotes == 0){
		//		display ... no reviews yet
		//}else{
			//	display movie.attributes.freshTotal/movie.attributes.freshVotes
		//}
	},

	renderReviews: function () {

	},

    // remove subviews on close of Details view
    onClose: function() {
        if (this.reviewerView) { this.reviewerView.remove(); }
        if (this.reviewThumbsView) { this.reviewThumbsView.remove(); }
    },
});
