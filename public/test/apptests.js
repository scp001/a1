//var fixtureEl = null; 

QUnit.jUnitReport = function(report) {
    console.log(report.xml);
}

//tests for DOM manipulation
//module('Model Tests: Movie and User');

 test('Check model initialization parameters and default values', function() {

  //create a new instance of a User model 
  var user = new splat.User({username: "Noah", password: "Jonah"});
  // test that model has parameter attributes
  equal(user.get("username"), "Noah", "User title set correctly");
  equal(user.get("password"), "Jonah", "User director set correctly");

  var movie = new splat.Movie();
  equal(movie.get("poster"), "img/placeholder.png",
	"Movie default value set correctly");
 });

 test( "Inspect jQuery.getJSON's usage of jQuery.ajax", function() {
    this.spy( jQuery, "ajax" );
    var getJSONDone = jQuery.getJSON( "http://cms-chorus.utsc.utoronto.ca:28012/movies" );
    ok( jQuery.ajax.calledOnce );
    equal( jQuery.ajax.getCall(0).args[0].url, "http://cms-chorus.utsc.utoronto.ca:28012/movies" );
    equal( jQuery.ajax.getCall(0).args[0].dataType, "json" );
  });

 test("Fires a custom event when the state changes.", function() {
    var spy = this.spy();
    var movie = new splat.Movie();
    movie.bind( "change", spy );
    movie.set( { "title": "Noah" } );
    ok( spy.calledOnce, "A change-event callback was correctly triggered" );
  });

 test("Test movie model/collection add/save, and callback functions.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var errorCallback = this.spy();
    var addModelCallback = this.spy();
    var movie = new splat.Movie();  // model
    var movies = new splat.Movies();  // collection
    assert.equal( movies.url, "/movies" );
    var length;
    movies.fetch({
        success: function(coll, resp) {
	    movies = coll;
            length = movies.length;
	    done1();
        }
    });
    movies.bind( "add", addModelCallback );
    movies.add(movie);
    assert.ok( addModelCallback.called );
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    user.save(null, {
        type: 'put',
    });
    done2();
    // try to save the added movie
    movie.save({"__v":0,"dated":"2015-10-21T20:44:27.403Z","director":"bbb","duration":10,"freshTotal":1,"freshVotes":2,"poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795","rating":"G","released":"1970","synopsis":"fun","title":"zaba","trailer":"http://a.com","userid":"54635fe6a1342684065f6959","genre":["e"],"starring":["d"]}, {
	error: function (model, error) {
	    assert.equal( error.status, 403, "Saving without authentication status returns a 403 error code from CSRF middleware" );
	    done3();
	}
    });
  });

 test("Test movie-delete triggers an error event if unauthenticated.", function(assert) {
    var done = assert.async();
    var movie = new splat.Movie();  // model
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    movie.set({"_id": "557761f092e40db92c3ccdae"});
    // try to destroy an existing movie
    movie.destroy({
	error: function (model, resp) {
	    assert.equal( resp.status, 403, "Deleting without authentication status returns a 403 error code from CSRF middleware" );
	    done();
	}
    });
  });

 test("Test movie-save succeeds if session is authenticated.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var user = new splat.User({username:"a", password:"a", login: 1});
    user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a", "Successful login with valid credentials" );
            done1();
        }
    });
    var movie = new splat.Movie();  // model
    movie.set("_id", "5650bf6b6f3c0a143c50994e");
    movie.urlRoot = '/movies';
    movie.fetch({
      success: function(movie, resp) {
        assert.equal( resp.title, "qunit!", "Successful movie fetch" );
	done2();
        // attempt to update existing movie
        movie.save({"title": "qunit!"}, {
    	    success: function (model, resp) {
    	        assert.equal( resp.title, "qunit!", "Saving model update succeeds when logged in" );
		done3();
    	    }
        });
      }
    });
  });
