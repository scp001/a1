// catch simple errors
"use strict";

// declare splat-app namespace, if it doesn't already exist
var splat = splat || {};

splat.utils = {

    // Asynchronously load templates located in separate .html files using
    // jQuery "deferred" mechanism, an implementation of Promises.  Note we
    // depend on template file names matching corresponding View file names,
    // e.g. Home.html and home.js which defines Backbone View "Home".
    /*
     * @param {[String]} views:  filenames of templates to be loaded
     * @param {function} callback:  callback function invoked when file is loaded
     */
    loadTemplates: function(views, callback) {

	// Array of deferred actions to keep track of template load status
        var deferreds = [];

	// Process each template-file in views array
        /*
         * @param {[integer]} index:  position of view template within views array
         * @param {[String]} view:  root name (w/o .html) of view template file
         */
        $.each(views, function(index, view) {
	    // If an associated Backbone view is defined, set its template function
            if (splat[view]) {

		// Push task of retrieving template file into deferred array.
		// Task performs "get" request to load the template, then passes
		// resulting template data to anonymous function to process it.
	        /*
	         * @param {String} data:  HTML from template file as String
	         */
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
	    	    // Set template function on associated Backbone view.
                    splat[view].prototype.template = _.template(data);
                }));

	    // No Backbone view file is defined; cannot set template function.
            } else {
                console.log(view + " not found");
            }
        });

	// When all deferred template-loads have completed,
	// invoke callback function.
        $.when.apply(null, deferreds).done(callback);
    },

	// display notice on alert class
    showNotice: function(title, text, type) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info alert-danger");
        $('.alert').addClass(type);
        $('.alert').html('<strong> ' + title +'! </strong> ' + text);
        $('.alert').show();
    },

	// hide notice in 5 secs
    hideNotice: function() {
        $('.alert').stop().delay(5000).fadeOut();
    },
	
	// remove notive immediately
	removeNotice: function() {
		$('.alert').stop();
	},
 
	// add error message to help-block
    addValidationError: function(field, message){
    	// use jQuery to address input field by its name attribute
    	var controlGroup = $('#' + field).parent().parent();
    	controlGroup.addClass('has-error');
    	$('.help-block', controlGroup).html(message);
    },
    
	// remove any error message
    removeValidationError: function (field){
    	// use jQuery to address input field by its name attribute
    	var controlGroup = $('#' + field).parent().parent();
    	controlGroup.removeClass('has-error');
    	$('.help-block', controlGroup).html("");
    },
	
	// add error message to help-block
    addSignupError: function(field, message){
    	// use jQuery to address input field by its name attribute
    	var controlGroup = $('#' + field).parent();
    	controlGroup.addClass('has-error');
    	$('.help-block', controlGroup).html(message);
    },
    
	// remove any error message
    removeSignupError: function (field){
    	// use jQuery to address input field by its name attribute
    	var controlGroup = $('#' + field).parent();
    	controlGroup.removeClass('has-error');
    	$('.help-block', controlGroup).html("");
    },

    addSigninError: function (field, message) {
        var controlGroup = $('#' + field).parent();
        controlGroup.addClass('has-error');
        $('.help-block', controlGroup).html(message);
    },

    removeSigninError: function (field){
        var controlGroup = $('#' + field).parent();
        controlGroup.removeClass('has-error');
        $('.help-block', controlGroup).html("");
    }
};
