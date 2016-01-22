// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Header) matches name of template file Header.html
splat.Header = Backbone.View.extend({
	
	events: {
		"change .sortOrder" : "sortOrder",
		"change .formcontrol" : "verifySingup",
		"click #singup-button" : "singup",
		"click #singin-button" : "singin",
	},

    // render the View
    render: function () {
		// set the view element ($el) HTML content using its template
		this.$el.html(this.template());
		return this;    // support method chaining
    },
	
	// set menu item active
	selectMenuItem: function (menuItem){
		// clear active status by default
		$(".nav li").removeClass('active');
		// set input menuItem to active
		if(menuItem){
			$('.'+menuItem).addClass('active');
		}
	},
	
	sortOrder: function(event){
		event.stopPropagation();
		splat.order = event.target.value;
		Backbone.trigger('orderevent' ,event);
		$('#orderDiv').removeClass('open');
		splat.app.navigate("#movies", {replace:true, trigger:true});
	},
	
	verifySingup: function(event){
		// object to hold form-field name:value pairs
		var changeObj = {};

		// Add change value to changeObj; change event is
		// triggered once for each changed field value
		changeObj[event.target.name] = _.escape(event.target.value);
        this.model.set(changeObj);
		
		// Run validation rule on changed item
		var check = this.model.validateItem(event.target.name);
		// check is tuple <isValid: Boolean, message: String>
		if (check.isValid) {
        	splat.utils.removeSignupError(event.target.name);
        }
		else{
			splat.utils.addSignupError(event.target.name, check.message);
		}
	},
	
	singup: function(event){
		// Pass if there is no validation error
		this.model.set($(event.target).closest('form').serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a; }, {}));

		var pass = true;
		// loop through all defaults
		for (var element in this.model.attributes){
			// Run validation rule on changed item
			var check = this.model.validateItem(element, this.model);
			// check is tuple <isValid: Boolean, message: String>
			if (check.isValid) {
        		splat.utils.removeSignupError(element);
        	}
			else{
				pass = false;
				splat.utils.addSignupError(element, check.message);
			}
		}

		// return if there is at least one error and show error message
		if(!pass){
			return;
		}


		this.collection.model = {};
		this.collection.model.prototype = {};
		this.collection.model.prototype.idAttribute = 'username';
		var newModel = this.collection.create(this.model, {
			wait: true,  // don't create client model until server responds
			success: function(response) {
				// notification panel, defined in section 2.6
				splat.utils.showNotice('Success', "New Account Created", 'alert-success');
				splat.utils.hideNotice();
			},
			error: function(response) {
				// display the error response from the server
				splat.utils.showNotice('Fail', "New Account was not created", 'alert-danger');
				splat.utils.hideNotice();
			},
		});
	},
	
	signin: function(event){
		var remember = this.$('#remember').value == '1' ? 1 : 0;
		
	},

});
