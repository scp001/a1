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
		"click #moviesave" : "addHandler",
		"click #moviedel" : "deleteHandler",
	},

	addHandler: function() {
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
        			splat.utils.showNotice('Fail', "Movie was not sucessfully updated", 'alert-error')
        			splat.utils.hideNotice()        			
    			},
    		});
		}
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
			wait: true,  // don't destroy client model until server responds
    		success: function(response) {   		
				// later, we'll navigate to the browse view upon success
        		splat.app.navigate('#movies/' + response.id, {replace:true, trigger:true});
				// notification panel, defined in section 2.6
        		splat.utils.showNotice('Success', "Movie added", 'alert-success')
        		splat.utils.hideNotice()
    		},
    		error: function(response) {
    			// display the error response from the server
        		splat.utils.requestFailed(response);
        		splat.utils.showNotice('Fail', "Movie was not sucessfully added", 'alert-error')
        		splat.utils.hideNotice()        			
    		},
		});
		}
	},
	
	deleteHandler: function() {
		this.model.destroy({
			wait: true,  // don't destroy client model until server responds
    		success: function(model, response) {
				// later, we'll navigate to the browse view upon success
        		splat.app.navigate('#', {replace:true, trigger:true});
				// notification panel, defined in section 2.6
        		splat.utils.showNotice('Success', "Movie deleted", 'alert-success')
         		splat.utils.hideNotice()       		
    		},
    		error: function(model, response) {
				// display the error response from the server
        		splat.utils.requestFailed(response);
         		splat.utils.hideNotice()       		
    		}
    	});
	},
});
