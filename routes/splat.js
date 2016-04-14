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


// use find to retrieve all movie models
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

// create a new movie model and save it
exports.addMovie = function(req, res){
		MovieModel.update({title: req.body.title}, req.body, {upsert: true}, function(err, movie){
			if(err) {
				if(err.code == 11000){
					res.status(403).send("Sorry, unable to create this movie: movie " + movie.title+
						" directed by " + movie.director + " already exists");
				} else {
					res.status(500).send("Sorry, unable to create the movie at this time ("
						+ err.message + ")");
				}
			} else {
				res.status(200).send(movie);
			}
		})
};

// reterive movie by id
exports.editMovie = function(req, res) {
	MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time ("
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
        		var newMovie = req.body;
        		var movieImage = newMovie["poster"];
				var matches = movieImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			    if(matches) {
					if (matches.length == 3) {
						var suffix = matches[1].split("/")[1],
							value = matches[2],
							id = newMovie["_id"],
							imageURL = '/public/img/uploads/' + id + "." + suffix,
							newPath = __dirname + '/..' + imageURL;
						newMovie['poster'] = imageURL;
						fs.writeFile(newPath, value, 'base64', function (err, message) {
						});
					}
				}
        		delete newMovie["_id"];
				delete newMovie["__0"];
				// update movie with request body
            	movie.update(newMovie, function(err, message){
					if(err){
						res.status(500).send("Sorry, unable to edit movie at this time ("
						+err.message+ ")");
					}  else {
						res.status(200).send(message);
					}
            	});
        }
    });

};

// reterive movie by id
exports.deleteMovie = function(req, res) {
	MovieModel.findById(req.params.id, function(err, movie){
	if(err) {
	    res.status(500).send("Sorry, unable to remove the movie at this time ("
		+ err.message + ")");
	} else if (!movie) {
	    res.status(404).send("Sorry, that movie does not exist");
	} else {
		// use model remove to remove movie
		MovieModel.remove({'_id':movie.id}, function(err, message){
				if (err){
					res.status(500).send("Sorry, unable to remove the movie (" +  err + ")");
				} else{
					CommentModel.remove({'movieId': movie.id}, function(err){
						if(err) res.status(500).send("Sorry, unable to remove the movie (" +  err + ")");
						else res.status(200).send(message);
					});
				}
		});
	}
	});
};

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

// use find to reterive all movies
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

// create a new review model and save it to server
exports.addReview = function(req, res){
	var newReview = new ReviewModel(req.body);
	newReview.save(function(err, review) {
	if(err) {
		res.status(500).send("Sorry, unable to create the review at this time ("
		+ err.message + ")");
	} else {
	    MovieModel.findById(review.movieId, function(err, movie) {
		movie.freshVotes += 1;
		movie.freshTotal += newReview.freshness;
		movie.save();
	    });
	    res.status(200).send(review);
	}
	});
};

exports.playMovie = function(req, res){

	// resolve file path
	var file = path.resolve(__dirname,"/..");
	// get sepcific range
	var range = req.headers.range;
	// get position
	var positions = range.replace(/bytes=/, "").split("-");
	// get start position
	var start = parseInt(positions[0], 10);

    	fs.stat(file, function(err, stats) {
      		var total = stats.size;
      		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      		var chunksize = (end - start) + 1;

      		res.writeHead(206, {
        		"Content-Range": "bytes " + start + "-" + end + "/" + total,
        		"Accept-Ranges": "bytes",
        		"Content-Length": chunksize,
        		"Content-Type": "video/mp4"
      		});

      		var stream = fs.createReadStream(file, { start: start, end: end }).on("open", function() {
          		stream.pipe(res);
        	}).on("error", function(err) {
          		res.end(err);
        	});
	});
};

exports.getUsers = function(req, res){
	UserModel.find({}, function(err, users) {
		if(err) {
			res.status(500).send("Sorry, unable to retrieve all users at this time ("
				+err.message + ")");
		}else{
			res.status(200).send(users);
		}
	});
};

exports.signup = function(req, res){
	console.log('we are in signup!', req.body);
	var newUser = new UserModel(req.body);
	UserModel.create(newUser);
	res.status(200).send([newUser]);
};

exports.signin = function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	if(!username || !password){
		res.status(403).send({'status' : "Invalid Username/Password"});
	}
	else {
		UserModel.findOne({'username': username, 'password': password}, function (err, user) {
			if (err) {
				res.status(500).send( { 'status' : "Sorry, unable to sign in at this time ("
					+ err.message + ")"});
			} else if (!user) {
				res.status(404).send({'status' : 'User is not registered yet'});
			} else {
				req.session.regenerate(function(){
					req.session.user = user;
					req.session.success = { 'status' : 'Authenticated as ' + user.username};
					res.status(200).send(req.session.success);
				});
			}
		})
	}
};

exports.addComment = function(req, res){
	var obj = req.body;
	if(!obj) res.status(400).send({'status' : "Bad Request"});
	else {
		var comment = new CommentModel(obj);
		CommentModel.create(comment, function(err){
			if(err) res.status(500).send( { 'status' : "Sorry, unable to add comment at this time ("
			+ err.message + ")"});
			else res.status(200).send([comment]);
		});
	}
};

exports.comments = function(req, res){
	if(!req.params.movieId) res.status(400).send({'status' : "Bad Request"});
	CommentModel.find({ movieId:  req.params.movieId}, function(err, comments){
		if(err) res.status(500).send( { 'status' : "Sorry, unable to get comments at this time  ("
		+ err.message + ")"});
		else {
			 res.status(200).send(comments);
		}
	})
};

exports.editComment = function(req, res) {
	if(!req.params.id) res.status(400).send({'status' : "Bad Request"});

	CommentModel.findById(req.params.id, function(err, comment) {
		if (err) {
			res.status(500).send(err.message);
		} else if (!comment) {
			res.status(404).send("Sorry, comment doesn't exist");
		} else {
			var newComment = req.body;
			delete newComment["_id"];
			delete newComment["__0"];
			// update movie with request body
			comment.update(newComment, function(err, message){
				if(err){
					res.status(500).send("Sorry, unable to edit comment at this time ("
						+err.message+ ")");
				}  else {
					res.status(200).send(message);
				}
			});
		}
	});
};

exports.deleteComment = function(req, res) {
	if(!req.params.id) res.status(400).send({'status' : "Bad Request"});

	CommentModel.findById(req.params.id, function(err, comment){
		if(err) {
			res.status(500).send(err.message);
		} else if (!comment) {
			res.status(404).send("Sorry, that comment does not exist");
		} else {
			// use model remove to remove movie
			CommentModel.remove({'_id':comment.id}, function(err, message){
				if (err){
					res.status(500).send("Sorry, unable to delete the comment (" +  message + ")");
				} else{
					res.status(200).send(message);
				}
			});
		}
	});
};

var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect(config.database, function(err) {
	if (err){
		console.error('Unable connect to database('+err+'), check database is up and running. Exiting.');
		process.exit(1);
	};
});



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
    dated: { type: Date, required: true}
	//userid : {type: String, required: true}
});

var CommentSchema = new mongoose.Schema({
	movieId: {type: String, required: true },
	username: {type: String, required: true},
	text: {type: String, required: true},
	dated: { type: Date, required: true}
});

var ReviewSchema = new mongoose.Schema({
	freshness : { type: Number, required: true},
	reviewName : { type: String, required: true },
	reviewAffil : { type: String, required: true },
	reviewText : { type: String, required: true },
	movieId : { type: String, required: true }
});

var UserSchema = new mongoose.Schema({
	username: {type:String, required: true},
	password: {type:String, required: true},
	email: {type:String, required: true}
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({"title":1, "director":1}, {unique:true, dropDups:true});

// each movieId:reviewAffil pair must be unique; duplicates are dropped
ReviewSchema.index({"movieId":1, "reviewAffil":1}, {unique:true, dropDups:true});

// each username must be unique; duplicates are dropped
UserSchema.index({"username":1}, {unique:true, dropDups:true});

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);
var ReviewModel = mongoose.model('Review', ReviewSchema);
var UserModel = mongoose.model('User', UserSchema);
var CommentModel = mongoose.model('Comment', CommentSchema);
