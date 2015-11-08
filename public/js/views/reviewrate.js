// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

splat.ReviewRate = Backbone.View.extend({
	
	// render the View
    render: function () {
		var reviewCollection = new splat.Reviews();
		var reviewsFetch = reviewCollection.fetch();
		this.template = _.template("... no reviews yet");
		
		var self = this;
		reviewsFetch.done(function(collection, response){
			var num = 0, value = 0;
			reviewCollection.each(function(review) {
				num += 1;
				value += review.freshness;
			});
			if (num > 0){
				var content = 'currently rated: ';
				value = Math.round( (value/num) * 1000) / 10;
				if (value >= 50.0){
					content += "<img src=\"img/fresh.gif\">";
				}else{
					content += "<img src=\"img/rotten.gif\">";
				}
				content += value + '%' + ' (' + num + ') ';
				this.template = _.template(content);
			}
		});
		
		this.$el.html(this.template());
		return this;
	},
});