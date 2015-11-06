"use strict";

var fs = require('fs'),
    // path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");

// Implementation of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
  res.status(200).send('<h3>Splat API is running!</h3>');
};

// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res){
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            res.status(200).send(movie);
        }
    });
};

exports.getMovies = function(req, res){
	MovieModel.find({}, function(err, movies) {
		if(err) {
			res.status(500).send("Sorry, unable to retrieve all movies at this time ("
				+err.message + ")");
		}else{
			res.status(200).send(movies);
		}
	});
};

exports.addMovie = function(req, res){
	var newMovie = new MovieModel(req.body);
	newMovie.save(function(err, movie) {
	if(err) {
		if(err.code == 11000){
			res.status(403).send("Sorry, unable to create this movie: movie " + newMovie.title+
				" directed by " + newMovie.director + " already exists");
		} else {
			res.status(500).send("Sorry, unable to create the movie at this time ("
			+ err.message + ")");
		}
	} else {
	    res.status(200).send(movie);
	}
	});
};

exports.editMovie = function(req, res) {
	MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
        		var newMovie = req.body;
        		delete newMovie["_id"];
        		delete newMovie["__0"];
            MovieModel.update(newMovie, function(err, message){
					if(err){
						res.status(500).send("Sorry, unable to edit movie at this time (" 
						+err.message+ ")");
					}  else {
						res.status(200).send(message);			
					}          
            });
        }
    });
	
}

exports.deleteMovie = function(req, res) {
	MovieModel.findById(req.params.id, function(err, movie){
	if(err) {
	    res.status(500).send("Sorry, unable to delete the movie at this time ("
		+ err.message + ")");
	} else if (!movie) {
	    res.status(404).send("Sorry, that movie does not exist");
	} else {
		MovieModel.remove({'_id':movie.id}, function(error, message){
				if (err){
					res.status(500).send("Sorry, unable to delete the movie (" +  message + ")");
				} else{
					res.status(200).send(message);
				}
		});
	}
	});
}

// upload an image file; returns image file-path on server
exports.uploadImage = function(req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.file.path,
        fileType = req.files.file.mimetype,
        // extract the MIME suffix for the user-selected file
        suffix = fileType.split(".")[1],
        // imageURL is used as the value of a movie-model poster field 
	// id parameter is the movie's "id" attribute as a string value
        imageURL = 'img/uploads/' + req.params.id + suffix,
        // rename the image file to match the imageURL
        newPath = __dirname + '/../public/' + imageURL;
    fs.rename(filePath, newPath, function(err) {
        if (!err) {
            res.status(200).send(imageURL);
        } else {
            res.status(500).send("Sorry, unable to upload poster image at this time (" 
                +err.message+ ")" );
	}
    });
};

exports.getReviews = function(req, res){
	ReviewModel.find({}, function(err, reviews) {
		if(err) {
			res.status(500).send("Sorry, unable to retrieve all review at this time ("
				+err.message + ")");
		}else{
			res.status(200).send(reviews);
		}
	});
};

exports.addReview = function(req, res){
	var newReview = new ReviewModel(req.body);
	newReview.save(function(err, review) {
	if(err) {
		res.status(500).send("Sorry, unable to create the review at this time ("
		+ err.message + ")");
	} else {
	    res.status(200).send(review);
	}
	});
};

var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
                '@10.15.2.164/' + config.dbname);

// Schemas
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    released: { type: String, required: true},
    starring: { type: [String], required: true},
    duration: { type: Number, required: true},
    genre: { type: [String], required: true},
    synopsis: { type: String, required: true},
    rating : { type: String, required: true},
    freshTotal : { type: Number, required: true},
    freshVotes : { type: Number, required: true},
    trailer : { type: String},
    poster: { type: String, required: true},
    dated: { type: Date, required: true},
});

var ReviewSchema = new mongoose.Schema({
	freshness : { type: Number, required: true},
	reviewName : { type: String, required: true },
	reviewAffil : { type: String, required: true },
	reviewText : { type: String, required: true },
	movieId : { type: String, required: true },
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({"title":1, "director":1}, {unique:true, dropDups:true});

// each movieId:reviewAffil pair must be unique; duplicates are dropped
ReviewSchema.index({"movieId":1, "reviewAffil":1}, {unique:true, dropDups:true});

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);
var ReviewModel = mongoose.model('Review', ReviewSchema);
