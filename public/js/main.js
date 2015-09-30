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
		
	},
	
	events: {
		"click #saveButton" : "addHandler",
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
		// instantiate a details view
		this.detailsView = new splat.Details({model:detailsModel});
		
		// insert the rendered Details view element into document DOM
		$('#content').html(this.detailsView.render().el);
		this.headerView.selectMenuItem("add-menu");
		document.body.style.backgroundImage = "none";
		document.body.style.backgroundColor = "black";
	},
	
	borwseMovie: function() {
		// If the Browse view doesn't exist, instantiate one
		if (!this.browseView) {
			this.browseView = new splat.MovieThumb();
		};
		
		// insert the rendered Details view element into document DOM
		$('#content').html(this.browseView.render().el);
		this.headerView.selectMenuItem("browse-menu");
		document.body.style.backgroundImage = "none";
		document.body.style.backgroundColor = "black";
	},
	
	addHandler: function() {
		collection.create();
	}
});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'Details', 'MovieThumb'], function() {
	splat.app = new splat.AppRouter();
	Backbone.history.start();
});