// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note collection for review model
splat.Reviews = Backbone.Collection.extend({

    // identify collections model
    model: splat.ReviewModel,

    // save review models under "splat" namespace,
    // since localStorage uses a flat namespace shared by all apps
    localStorage: new Backbone.LocalStorage('splat')

});