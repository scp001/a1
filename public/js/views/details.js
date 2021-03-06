// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Details) matches name of template file Details.html
splat.Details = Backbone.View.extend({

    // render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		if(this.model) {
			this.$el.html(this.template(this.model.toJSON()));


			var self = this;
			// instantiate a MovieForm subview and append its markup to designated tag in self
			$.get('tpl/MovieForm.html', function (data) {
				var template = _.template(data);
				self.$('#movieform').append(template(self.model.toJSON()));
			});

			// instantiate a MovieImg subview and append its markup to designated tag in self
			$.get('tpl/MovieImg.html', function (data) {
				var template = _.template(data);
				self.$('#movieimg').append(template(self.model.toJSON()));
			});

			$.ajax({
				type: 'GET',
				url: '/comments/' + this.model.attributes._id,
				dataType: 'text',
				success: function (response) {
					if (response) {
						var comments = [];
						var data = JSON.parse(response);
						_.forEach(data, function (item) {
							var html =
									'<div  style="padding: 0; margin-bottom: 40px; width:33vw">' +
									'<textarea disabled title="text" class="form-control"  name="text" style="resize: none" cols="30" rows="3">' + item.username + ': ' + item.text +
									'</textarea><span> Created at: ' + item.dated + '<span style="float: right">  ' +
									'<a href="javascript:;" style="color: #fff"> Edit </a> | <a href="javascript:;" style="color: #fff"> Delete </a> </span></span>' +
									'</div>';
							comments.push(html);
						});

						var template = _.template(
								'<div style="margin-left: 8vw;">' +
								'<h1> Recent Comments </h1>' + comments + '</div>'
						);
						self.$('#comments').append(template(self.model.toJSON()).replace(/,/g, ""));
					}
				},
				error: function (response) {
					console.log(response);
				}
			});
		}

		if (this.model.id){
			// var reviewRateView = new splat.ReviewRate();
			// this.$('.rate').append(reviewRateView.render().el);

			// var template = _.template("<a href=\"#movies/<%= _id %>/reviews\">Reviews</a>");
			// this.$('.review').append(template(self.model.toJSON()));

			if (this.model.attributes.freshVotes == 0.0){

				var reviewTemplate = _.template("<a href=\"#movies/<%= _id %>/reviews\"><div class=\"rottenpic\">N/A</div></a>");
				this.$('.rate').append(reviewTemplate(self.model.toJSON()));
			}else{
				var reviewTemplate = _.template("<a href=\"#movies/<%= _id %>/reviews\"><div class=<%= (Math.floor(freshTotal/freshVotes*1000)/10 >= 50.0 ) ? \"freshpic\" : \"rottenpic\" %>> <%= Math.floor(freshTotal/freshVotes*1000)/10 %>%(<%= freshVotes%>) </div></a>");
				this.$('.rate').append(reviewTemplate(self.model.toJSON()));
			}
		}

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
		"click #commentAdd" : "addComment"
	},



	// add handler event
	addHandler: function() {
		// Remove any existing alert message
		splat.utils.removeNotice();

		// Pass if there is no validation error
		var pass = true;
		// loop through all defaults
		for (var element in this.model.defaults){
			// Run validation rule on changed item
			var check = this.model.validateItem(element);
			// check is tuple <isValid: Boolean, message: String>
			if (check.isValid) {
        		splat.utils.removeValidationError(element);
        	}
			else{
				pass = false;
				splat.utils.addValidationError(element, check.message);
			}
		}

		// return if there is at least one error and show error message
		if(!pass){
			splat.utils.showNotice('Fail','Errors need to be fixed!','alert-danger' );
			splat.utils.hideNotice();
			return;
		}

		// Remove any existing alert message
		splat.utils.removeNotice();
		// if the model is already created
		if(this.model.id){
			var oldModel = this.collection.get(this.model.id);
			// save model to collection
			oldModel.save(this.model.attributes,{
				wait: true,  // don't destroy client model until server responds
    			success: function(response) {
					// notification panel, defined in section 2.6
        			splat.utils.showNotice('Success', "Movie updated", 'alert-success');
        			splat.utils.hideNotice()
    			},
    			error: function(response) {
    				// display the error response from the server
        			splat.utils.showNotice('Fail', "Movie was not sucessfully updated", 'alert-danger');
        			splat.utils.hideNotice()
    			}
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
        		splat.utils.showNotice('Fail', "Movie was not sucessfully added", 'alert-danger');
        		splat.utils.hideNotice();
    		}
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
		changeObj[event.target.name] = _.escape(event.target.value);
        this.model.set(changeObj);
        splat.utils.showNotice('Note', 'Movie attribute updated; to make changes permanent, click "Save Changes" button', 'alert-info');
		splat.utils.hideNotice();
		// reflect changes back to the model

		// Run validation rule on changed item
		var check = this.model.validateItem(event.target.name);
		// check is tuple <isValid: Boolean, message: String>
		if (check.isValid) {
        	splat.utils.removeValidationError(event.target.name);
        }
		else{
			splat.utils.addValidationError(event.target.name, check.message);
		}
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
        		splat.utils.showNotice('Fail', 'Movie was not sucessfully deleted: ' + response, 'alert-danger');
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
	resize: function(sourceImg, type, quality, callback) {
		var type = type || "image/jpeg"; // default MIME image type
		var quality = quality || "0.95"; // tradeoff quality vs size
		var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
		image.src = sourceImg;
		image.height = 282;
		image.width = 375;
		var canvas = document.createElement("canvas");
		canvas.width = image.width; // scale canvas to match image
		canvas.height = image.height;
		var ctx = canvas.getContext("2d"); // get 2D rendering context
		ctx.drawImage(image,0,0, image.width, image.height); // render
		return canvas.toDataURL(type, quality);
	},

	addComment: function(){
		var scope = this;

		$.ajax({
			type: 'POST',
			url: '/comments',
			dataType: 'text',
			data: { movieId: this.model.attributes._id, username: $('#commentUsername').val(), text: $('#commentText').val() , dated: new Date() },
			success: function(response){
				splat.utils.showNotice('Success', "Successfully added comment", 'alert-success');
				splat.utils.hideNotice();
				scope.render();
			},
			error: function(response) {
				splat.utils.showNotice('Failed', "Failed to add comment", 'alert-danger');
				splat.utils.hideNotice();
			}
		});
	}
});
