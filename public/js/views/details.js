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
		"dragover #detailsImage" : "dragoverHandler",
		"drop #detailsImage" : "dropHandler",
		"change #uploadPic" : "selectImg",
	},

	// add handler event
	addHandler: function() {
		// Remove any existing alert message
		splat.utils.removeNotice();
		
		// if the model is already created
		if(this.model.id){
			var oldModel = this.collection.get(this.model.id);
			oldModel.save(this.model,{
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
			var newModel = this.collection.create(this.model, {
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

	// avoid multi-upload cost if user reselects image
	selectImg: function(event){
		// set object attribute for image uploader
		this.pictureFile = event.target.files[0];
		// if the file is image, read it
		if (this.pictureFile.type.match(/^image\/(jpg|jpeg|png|gif)$/)){
			this.imageRead(this.pictureFile, this.pictureFile.type);
		}else{
			alert("The file is not a picture");
		}
	},

	// Read pictureFile from file system
	imageRead: function(pictureFile, type){
		var self = this;
		var reader = new FileReader();
		// callback for when read operation is ready
		reader.onload = function(event){
			var targetImgElt = $("#detailsImage")[0];
			var newImage = self.resize(reader.result, type);
			targetImgElt.src = newImage;
			self.model.set('poster', newImage);
		};
		// read image File
		reader.readAsDataURL(pictureFile);

	},
	
	// Handle drag-and-drop picture
	dragoverHandler: function(event){
		// don't let parent element catch event
		event.stopPropagation();
		// prevent default to enable drop event
		event.preventDefault();
		// use original event
		event.originalEvent.dataTransfer.dropEffect = 'copy';
	},

	dropHandler: function(event){
		// don't let parent element catch event
		event.stopPropagation();
		// prevent default to enable drop event
		event.preventDefault();
		var ev = event.originalEvent;
		// set object attribute for use by uploadPicture
		this.pictureFile = ev.dataTransfer.files[0];
		// only process image files
		if(this.pictureFile.type.match(/^image\/(jpg|jpeg|png|gif)$/)){
			// read image
			this.imageRead(this.pictureFile, this.pictureFile.type);
		}else{
			alert("The file is not a picture");
		}
	},

	// Resize sourceImg, returning result as a DataURL value. Type,
	// quality are optional params for image-type and quality setting
	resize: function(sourceImg, type, quality) {
		var type = type || "image/jpeg"; // default MIME image type
		var quality = quality || "0.95"; // tradeoff quality vs size
		var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
		image.src = sourceImg;
		image.height = MAX_HEIGHT;
		image.width = MAX_WIDTH;
		var canvas = document.createElement("canvas");
		canvas.width = image.width; // scale canvas to match image
		canvas.height = image.height;
		var ctx = canvas.getContext("2d"); // get 2D rendering context
		ctx.drawImage(image,0,0, image.width, image.height); // render
		return canvas.toDataURL(type, quality);
	},
});
