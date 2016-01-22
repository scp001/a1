var testGoogle = function() {
    var text = 'click "Sign in" \n title should be "Sign in with your Google Account" ';
    var link = 'https://www.google.ca/';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testC09Auth = function(){
    var text = 'title should be "C09 Eatz Project" \n click "Sign In" \n fill Username "root" \n fill Password "Testroot1" \n click "Sign in"';
    var link = 'http://localhost:9000/';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testC09Reg = function() {
    var text = 'title should be "C09 Eatz Project" \n click "Sign Up" \n fill Username "root" \n fill Email "root@gmail.com" \n fill Password "Testroot1" \n fill "Re-entered Password" "Testroot1" \n click "Sign up"';
    var link = 'http://localhost:9000/';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

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
click button "Sing Up"
wait 3
click "Add Movie"
   */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();


    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatAuth = function() {

    var text = (function () {/*
     title should be "Splat"
     wait until title is "Splat"
     click "Sign In"
     wait until title is "Splat"
     fill Username "root"
     wait until title is "Splat"
     fill Password "Testroot1"
     wait until title is "Splat"
     click "Sign in"
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();
    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatAddMovie = function() {
    var text = 'title should be "Splat" \n wait until ready \n click "Add a new movie" \n fill Title "The Revenant" \n fill Released "2015" \n fill Director "Alejandro González Iñárritu" \n' +
        'fill Rating "R" \n fill Starring " Leonardo DiCaprio, Tom Hardy" \n fill Duration "154 minutes" \n fill Genre(s) "adventure, drama" \n fill synopsis "Description" \n' +
        'fill "Trailer URL" "http://www.imdb.com/video/playlist/title?tconst=tt1663202&rid=undefined&refsuffix=tt_ov_vi" \n click "Save Changes" ';
    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};