// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Review) matches name of template file Reviews.html
splat.ReviewsView = Backbone.View.extend({

	initialize: function(options) {
		this.movies = options.movies;

		// invoke showScore and renderReviews methods when collection is sync'd
		this.listenTo(this.collection, "sync", this.showScore);
		this.listenTo(this.collection, "sync", this.renderReviews);
	},

    // render the View
    render: function () {
		
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));

		// render Reviewer subview
		this.reviewerView = new splat.Reviewer({model: this.model, collection: this.collection, movies: this.movies});
		this.$('#reviewer').append(this.reviewerView.render().el);

		// render ReviewThumbs subview
		this.reviewThumbsView = new splat.ReviewThumbs({model: this.model, collection: this.collection});
		this.$('#reviewthumbs').append(this.reviewThumbsView.render().el);

		return this;
    },

	showScore: function () {
		var moviesFetch = this.movies.fetch();
		var self = this;
		moviesFetch.done(function(collection, response){
		var movie = self.movies.get(self.model.attributes.movieId);

		if (movie.attributes.freshVotes == 0){
			var reviewTemplate = _.template("... no reviews yet");
			self.$('.rate').append(reviewTemplate(self.model.toJSON()));
		}
		else{
			self.$('.rate').empty()
			var rating = Math.floor(movie.attributes.freshTotal / movie.attributes.freshVotes*1000)/10;
			if (rating >= 50.0){
				self.$('.rate').append('current rated: <image src="img/fresh.gif">');
			}
			else{
				self.$('.rate').append('current rated: <image src="img/rotten.gif">');
			}
			self.$('.rate').append(rating + "%" + "(" + movie.attributes.freshVotes + ")");
		}
		});
	},

	renderReviews: function () {
		
		this.reviewThumbsView = new splat.ReviewThumbs({model: this.model, collection: this.collection});
		this.$('#reviewthumbs').append(this.reviewThumbsView.render().el);
		return this;
	},

    // remove subviews on close of Details view
    onClose: function() {
        if (this.reviewerView) { this.reviewerView.remove(); }
        if (this.reviewThumbsView) { this.reviewThumbsView.remove(); }
    },
});
