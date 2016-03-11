var  _ = require('lodash');

var links = (function () {
    var splatLink = 'http://localhost:41484/index.html';
    return {
        splat: function(){
            return splatLink;
        }
    };
})();

//define test scenarios (if not exists in db)
var defaultScenarios = [

    {
        name: 'SplatReg',
        url: links.splat(),
        scenario: (function () {/*
         title should be "Splat"
         wait 0.5
         click "Sign Up"
         wait 0.5
         fill Username "root"
         wait 0.5
         fill Email "root@gmail.com"
         wait 0.5
         fill Password "Testroot1"
         wait 0.5
         fill "Enter Password Again" "Testroot1"
         wait 0.5
         click element with id "singup-button"
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatAuth',
        url: links.splat(),
        scenario:  (function () {/*
         title should be "Splat"
         wait 0.5
         click "Sign In"
         wait 0.5
         fill element with id "singin-username" "root"
         wait 0.5
         fill element with id "singin-password" "Testroot1"
         wait 0.5
         click element with id "remember"
         wait 0.5
         click element with id "singin-button"
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatOrderMoviesByTitle',
        url: links.splat(),
        scenario:  (function (){/*
         title should be "Splat"
         wait 0.5
         click "Browse Movies"
         wait 0.5
         click element with id byTitle
         wait 0.5
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatOrderMoviesByDirector',
        url: links.splat(),
        scenario: (function (){/*
         title should be "Splat"
         wait 0.5
         click "Browse Movies"
         wait 0.5
         click element with id byDirector
         wait 0.5
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatAddDeleteMovie',
        url: links.splat(),
        scenario: (function (){/*
         title should be "Splat"
         wait 0.5
         click "Add Movie"
         wait 0.5
         fill element with id title "The Revenant"
         wait 0.5
         fill element with id released "2015"
         wait 0.5
         fill element with id director "Alejandro Iniarritu"
         wait 0.5
         fill element with id rating "R"
         wait 0.5
         fill element with id starring " Leonardo DiCaprio, Tom Hardy"
         wait 0.5
         fill element with id duration "154"
         wait 0.5
         fill element with id genre "adventure, drama"
         wait 0.5
         fill element with id synopsis "Description"
         wait 0.5
         fill element with id trailer "https://youtu.be/QRfj1VCg16Y"
         click "Save Changes"
         wait 0.5
         click "Splat!"
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheRevenant"
         wait 0.5
         click "Delete Movie"
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatAddUpdateDeleteMovie',
        url: links.splat(),
        scenario:  (function (){/*
         title should be "Splat"
         wait 0.5
         click "Add Movie"
         wait 0.5
         fill element with id title "The Hateful Eight"
         wait 0.5
         fill element with id released "2015"
         wait 0.5
         fill element with id director "Quentin Tarantino"
         wait 0.5
         fill element with id rating "R"
         wait 0.5
         fill element with id starring "Samuel Jackson, Kurt Russell"
         wait 0.5
         fill element with id duration "187"
         wait 0.5
         fill element with id genre "crime, drama"
         wait 0.5
         fill element with id synopsis "Description"
         wait 0.5
         fill element with id trailer "https://youtu.be/nIOmotayDMY"
         click "Save Changes"
         wait 0.5
         click "Splat!"
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheHatefulEight"
         wait 0.5
         fill element with id synopsis " summary"
         wait 0.5
         click "Save Changes"
         click "Save Changes"
         wait 0.5
         click "Splat!"
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheHatefulEight"
         wait 0.5
         click "Delete Movie"
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },

    {
        name: 'SplatAddComment',
        url: links.splat(),
        scenario: (function () {/*
         title should be "Splat"
         wait 0.5
         click "Add Movie"
         wait 0.5
         fill element with id title "The Big Short"
         wait 0.5
         fill element with id released "2015"
         wait 0.5
         fill element with id director "Adam McKay"
         wait 0.5
         fill element with id rating "R"
         wait 0.5
         fill element with id starring "Christian Bale, Steve Carell, Ryan Gosling, Brad Pitt"
         wait 0.5
         fill element with id duration "130"
         wait 0.5
         fill element with id genre "biography, drama"
         wait 0.5
         fill element with id synopsis "Description"
         wait 0.5
         fill element with id trailer "https://youtu.be/LWr8hbUkG9s"
         click "Save Changes"
         wait 0.5
         click "Splat!"
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheBigShort"
         wait 0.5
         fill element with id commentUsername "user1234"
         wait 0.5
         fill element with id commentText "Great movie. Highly recommend this!"
         wait 0.5
         click "Save Comment"
         wait 0.5
         page should contains "user1234: Great movie. Highly recommend this!"
         wait 0.5
         click "Splat!"
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheBigShort"
         wait 0.5
         click "Delete Movie"
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    }

];

var defaultScenariosNames = (function(){
    var arr = [];
    _.each(defaultScenarios, function(item){
        arr.push(item.name)
    });
    return arr;
})();

module.exports = {
    all: defaultScenarios,
    names: defaultScenariosNames
};
