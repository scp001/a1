// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({
	// Map "URL paths" to "router functions"
	routes: {
		"": "home",
		"About": "about",
		"movies" : "borwseMovie",
		"movies/add": "addMovie",
		"movies/:id": "editMovie",
		"movies/:id/reviews": "addReview",

	},
	
	// When an instance of an AppRouter is declared, create a Header view
	initialize: function() {

		// instantiate a Header view
		this.headerView = new splat.Header();
		// insert the rendered Header view element into the document DOM
		$('.header').html(this.headerView.render().el);
	},
	
	home: function() {
		// If the Home view doesn't exist, instantiate one
		if (!this.homeView) {
			this.homeView = new splat.Home();
		};
		
		// insert the rendered Home view element into the document DOM
		$('#content').html(this.homeView.render().el);
		document.body.style.backgroundSize = "100%";
		document.body.style.backgroundImage = "url('img/splash.jpg')";
		
		// clean other actived header
		this.headerView.selectMenuItem();
	},
	
	about: function() {
		// If the About view doesn't exist, instantiate one
		if (!this.aboutView) {
			this.aboutView = new splat.About();
		};
		
		// insert the rendered About view element into the document DOM
		$('#content').html(this.aboutView.render().el);
		this.headerView.selectMenuItem("about-menu");
		document.body.style.backgroundImage = "none";
		document.body.style.backgroundColor = "black";
	},
		
	addMovie: function() {
		// instantiate a details model
		var detailsModel = new splat.MovieModel();
		
		// instantiate a movie collection
		if (!this.movieCollection){
			this.movieCollection = new splat.Movies();
		}
		
		// instantiate a details view
		this.detailsView = new splat.Details({model:detailsModel, collection: this.movieCollection});
		
		// insert the rendered Details view element into document DOM
		$('#content').html(this.detailsView.render().el);
		this.headerView.selectMenuItem("add-menu");
		document.body.style.backgroundImage = "none";
		document.body.style.backgroundColor = "black";
	},
	
	borwseMovie: function() {
		// instantiate a movie collection
		if (!this.movieCollection){
			this.movieCollection = new splat.Movies();
		}
		
		var self = this;
		// reinitialize storage if necessary
		var moviesFetch = this.movieCollection.fetch();
		moviesFetch.done(function(collection, response){
			// instantiate a browse view
			self.browseView = new splat.MovieThumb({collection: self.movieCollection});
		
			// insert the rendered Details view element into document DOM
			$('#content').html(self.browseView.render().el);
			self.headerView.selectMenuItem("browse-menu");
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = "black";
		}).fail(function(collection, response){
			splat.utils.showNotice("Error", "Cannot connect to storage", "alert-error")
			spalt.utils.hideNotice();
		});
	},
	
	editMovie: function(id) {
		// instantiate a movie collection
		if (!this.movieCollection){
			this.movieCollection = new splat.Movies();
		}
		
		var self = this;
		// reinitialize storage if necessary
		var moviesFetch = this.movieCollection.fetch();
		moviesFetch.done(function(collection, response){
			// retrieve a details model
			var detailsModel = self.movieCollection.get(id);
			// instantiate a details view
			self.detailsView = new splat.Details({model:detailsModel, collection: self.movieCollection});
		
			// insert the rendered Details view element into document DOM
			$('#content').html(self.detailsView.render().el);
			self.headerView.selectMenuItem("add-menu");
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = "black";
		}).fail(function(collection, response){
			splat.utils.showNotice("Error", "Cannot connect to storage", "alert-danger");
			splat.utils.hideNotice();
		})			
	},

	addReview: function() {

		// instantiate a movie collection
		if (!this.reviewCollection){
			this.reviewCollection = new splat.Reviews();
		}

		var self = this;
		// reinitialize storage if necessary
		var reviewsFetch = this.reviewCollection.fetch();
		reviewsFetch.done(function(collection, response){
			var reviewsModel = new splat.ReviewModel();
			// instantiate a reviews view
			self.reviewsView = new splat.ReviewsView({model:reviewsModel, collection: self.reviewCollection});
			// insert the rendered Details view element into document DOM
			$('#content').html(this.reviewsView.render().el);
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = "black";
		}).fail(function(collection, response){
			splat.utils.showNotice("Error", "Cannot connect to storage", "alert-danger");
			splat.utils.hideNotice();
		})

	},



});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'Details', 'MovieThumb', 'ReviewsView', 'Reviewer', 'ReviewThumbs'], function() {
	splat.app = new splat.AppRouter();
	Backbone.history.start();
});