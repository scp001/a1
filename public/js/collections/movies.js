// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

splat.Movies = Backbone.Collection.extend({

    // identify collections model
    model: splat.MovieModel,

    // save movie models under "splat" namespace,
    // since localStorage uses a flat namespace shared by all apps
    localStorage: new Backbone.LocalStorage('splat')

});