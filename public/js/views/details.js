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
		
		var self = this;
		// instantiate a MovieForm subview and append its markup to designated tag in self
		$.get('tpl/MovieForm.html', function(data){
			var template = _.template(data);
			self.$('#movieform').append(template(self.model.toJSON()));
		});	

		// instantiate a MovieImg subview and append its markup to designated tag in self
		$.get('tpl/MovieImg.html', function(data){
			var template = _.template(data);
			self.$('#movieimg').append(template(self.model.toJSON()));
		});		
				
		return this;    // support method chaining
    },
	
	// define events	
	events: {
		"change .form-control" : "change",
		"click #moviesave" : "addHandler",
		"click #moviedel" : "deleteHandler",
	},

	// add handler event
	addHandler: function() {
		// Remove any existing alert message
		splat.utils.removeNotice();
		
		// if the model is already created
		if(this.model.id){
			var model = this.collection.get(this.model.id);
			model.save({
				title: $("#title").val(),
				released: $("#released").val(),
				director: $("#director").val(),
				rating: $("#rating").val(),
				starring: $("#starring").val(),
				duration: $("#duration").val(),
				genre: $("#genre").val(),
				synopsis: $("#synopsis").val(),
				trailer: $("#trailer").val(),
			  },{
				wait: true,  // don't destroy client model until server responds
    			success: function(response) {   		
					// later, we'll navigate to the browse view upon success
        			splat.app.navigate('#movies/' + response.id, {replace:true, trigger:true, remove:false});
					// notification panel, defined in section 2.6
        			splat.utils.showNotice('Success', "Movie updated", 'alert-success')
        			splat.utils.hideNotice()
    			},
    			error: function(response) {
    				// display the error response from the server
        			splat.utils.requestFailed(response);
        			splat.utils.showNotice('Fail', "Movie was not sucessfully updated : " + response, 'alert-error')
        			splat.utils.hideNotice()        			
    			},
    		});
		} // create a new model in collection
		else{
			var newModel = this.collection.create({
				title: $("#title").val(),
				released: $("#released").val(),
				director: $("#director").val(),
				rating: $("#rating").val(),
				starring: $("#starring").val(),
				duration: $("#duration").val(),
				genre: $("#genre").val(),
				synopsis: $("#synopsis").val(),
				trailer: $("#trailer").val(),
			}, {
			wait: true,  // don't create client model until server responds
    		success: function(response) {   		
				// later, we'll navigate to the browse view upon success
        		splat.app.navigate('#movies/' + response.id, {replace:true, trigger:true});
				// notification panel, defined in section 2.6
        		splat.utils.showNotice('Success', "Movie added", 'alert-success');
        		splat.utils.hideNotice();
    		},
    		error: function(response) {
    			// display the error response from the server
        		splat.utils.requestFailed(response);
        		splat.utils.showNotice('Fail', "Movie was not sucessfully added", 'alert-error');
        		splat.utils.hideNotice();
    		},
		});
		}
	},
	
	// change event for form-control
	change: function (event) {
		// Remove any existing alert message
		splat.utils.removeNotice();
		// object to hold form-field name:value pairs
		var changeObj = {};
		
		// Add change value to changeObj; change event is
		// triggered once for each changed field value
		changeObj[event.target.name] = event.target.value;
		// reflect changes back to the model
		this.model.set(changeObj);
		
        // Remove any existing alert message
        splat.utils.showNotice('Note', 'Movie attribute updated; to make changes permanent, click "Save Changes" button', 'alert-info');
        splat.utils.hideNotice();
		
		// Run validation rule on changed item
		var check = this.model.validateItem(event.target.name);
		
		// check is tuple <isValid: Boolean, message: String>
		check.isValid ? 
			splat.utils.removeValidationError(event.target.name)
			:splat.utils.addValidationError(event.target.name, check.message);
    },

	// delete handler event	
	deleteHandler: function() {
		// Remove any existing alert message
		splat.utils.removeNotice();
		
		// Destroy the model
		this.model.destroy({
			wait: true,  // don't destroy client model until server responds
    		success: function(model, response) {
				// later, we'll navigate to the browse view upon success
        		splat.app.navigate('#movies', {replace:true, trigger:true});
				// notification panel, defined in section 2.6
        		splat.utils.showNotice('Success', "Movie deleted", 'alert-success');
         		splat.utils.hideNotice();
    		},
    		error: function(model, response) {
				// display the error response from the server
        		splat.utils.requestFailed(response);
         		splat.utils.hideNotice();
    		}
    	});
	},
});
