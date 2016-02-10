// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note model for movie
splat.CommentModel = Backbone.Model.extend({
    idAttribute: "_id", //model id in server side

    defaults: {
        movieId: '',
        username: '',
        text: '',
        dated: new Date()
    }
});