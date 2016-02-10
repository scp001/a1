// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note collection for comments model
splat.Comments = Backbone.Collection.extend({

    // identify collections model
    model: splat.CommentModel,

    // save movie models under "splat" namespace,
    // since localStorage uses a flat namespace shared by all apps
    //localStorage: new Backbone.LocalStorage('splat')

    // move local storage to server
    url: '/comments/:movieId'
});