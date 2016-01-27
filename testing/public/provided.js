var testSplatReg = function() {

  var text = (function () {/*
    title should be "Splat"
    wait 4
    click "Sign Up"
    wait 2
    fill Username "root"
    fill Email "root@gmail.com"
    fill Password "Testroot1"
    fill "Enter Password Again" "Testroot1"
    click element with id "singup-button"
    wait 3
   */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatAuth = function() {

    var text = (function () {/*
     title should be "Splat"
     wait 4
     click "Sign In"
     wait 2
     fill element with id "singin-username" with value "root"
     fill element with id "singin-password" with value "Testroot1"
     click element with id "remember"
     click element with id "singin-button"
     wait 3
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatAddMovie = function() {
    var text = (function (){/*
     title should be "Splat"
     wait 4
     click "Add a new movie"
     wait 2
     fill Title "The Revenant"
     fill Released "2015"
     fill Director "Alejandro Iniarritu"
     fill Rating "R"
     fill Starring " Leonardo DiCaprio, Tom Hardy"
     fill Duration "154"
     fill Genre(s) "adventure, drama"
     fill synopsis "Description"
     fill "Trailer URL" "http://www.imdb.com/video/playlist/title?tconst=tt1663202&rid=undefined&refsuffix=tt_ov_vi"
     click "Save Changes"
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};