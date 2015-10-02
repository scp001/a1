// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Details) matches name of template file Details.html
splat.Details = Backbone.View.extend({

    // render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template(this.model.toJSON()));
		return this;    // support method chaining
    },
	
	events: {
		"click #saveButton" : "addHandler",
		"click #deleteButton" : "deleteHandler",
	},

	addHandler: function() {
		this.collection.create();
	},
	
	deleteHandler: function() {
		splat.utils.showNotice("lol", "alert-danger");
		// this.model.destory();
	},
});
