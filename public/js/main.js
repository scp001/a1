// catch simple errors
"use strict";
// declare splat-app namespace if it doesn't already exist
var splat = splat || {};
// Define Backbone router
splat.AppRouter = Backbone.Router.extend({
// Map "URL paths" to "router functions"
routes: {
"": "home"
},

// When an instance of an AppRouter is declared, create a Header view
initialize: function() {

// instantiate a Header view
this.headerView = new splat.Header();
// insert the rendered Header view element into the document DOM
$('.header').html(this.headerView.render().el);
},
home: function() {
// If the Home view doesn't exist, instantiate one
if (!this.homeView) {
this.homeView = new splat.Home();
};
// insert the rendered Home view element into the document DOM

$('#content').html(this.homeView.render().el);
}
});
// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header'], function() {
splat.app = new splat.AppRouter();
Backbone.history.start();
});