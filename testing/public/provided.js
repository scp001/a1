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
     fill element with id "singin-username" "root"
     fill element with id "singin-password" "Testroot1"
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
     click "Add Movie"
     wait 2
     fill element with id title "The Revenant"
     fill element with id released "2015"
     fill element with id director "Alejandro Iniarritu"
     fill element with id rating "R"
     fill element with id starring " Leonardo DiCaprio, Tom Hardy"
     fill element with id duration "154"
     fill element with id genre "adventure, drama"
     fill element with id synopsis "Description"
     fill element with id trailer "https://youtu.be/QRfj1VCg16Y"
     click "Save Changes"
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatUpdateMovie = function() {
    var text = (function (){/*
     title should be "Splat"
     wait 4
     click "Browse Great Movies"
     wait 2
     click element with id "TheRevenant"
     wait 2
     fill element with id synopsis "summary"
     wait 4
     click "Save Changes"
     click "Save Changes"
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};

var testSplatDeleteMovie = function() {
    var text = (function (){/*
     title should be "Splat"
     wait 4
     click "Browse Great Movies"
     wait 2
     click element with id "TheRevenant"
     click "Delete Movie"
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();

    var link = 'https://localhost:41484/index.html';

    document.getElementById('humanArea').value = text;
    document.getElementById('url').value = link;
};