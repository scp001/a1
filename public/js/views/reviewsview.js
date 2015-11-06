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
		"click #reviewsave" : "addReviewHandler"
	},

	// addReview handler event
	addReviewHandler: function() {

		if(this.model.id){
			var oldModel = this.collection.get(this.model.id);
			// save model to collection
			oldModel.save(this.model.attributes,{
				wait: true,  // don't destroy client model until server responds
    			success: function(response) {
    				// display the success response
        			splat.utils.showNotice('Success', "Movie updated", 'alert-success')
        			splat.utils.hideNotice()
    			},
    			error: function(response) {
    				// display the error response from the server
        			splat.utils.showNotice('Fail', "Movie was not sucessfully updated", 'alert-danger')
        			splat.utils.hideNotice()
    			},
    		});
		} // create a new model in collection
		else{
			var newModel = this.collection.create(this.model, {
			wait: true,  // don't create client model until server responds
    		success: function(response) {
				// later, we'll navigate to the browse view upon success
        		splat.app.navigate('#movies/' + response.id, {replace:true, trigger:true});
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
		}
	},
});
