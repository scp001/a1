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
    },
    {
      name: 'SplatOrderMoviesByTitleDropdown',
      url: links.splat(),
      scenario: ( function(){/*
title should be "Splat"
wait 0.5
radiogroup "Browse Movies" select "title"
      */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },
    {
      name: 'SplatAddUpdateDeleteMovieWaitUntilAJAX',
      url: links.splat(),
      scenario: ( function(){/*
title should be "Splat"
wait 0.5
click "Add Movie"
wait on response 500
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
wait on response 500
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
wait 0.5
click "Splat!"
title should be "Splat"
wait 0.5
click "Browse Great Movies"
wait on response 500
click element with id "TheHatefulEight"
wait on response 500
click "Delete Movie"
wait on response 500
      */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },
    {
      name: 'SplatAddUpdateDeleteMovieCheckRegex',
      url: links.splat(),
      scenario: ( function(){/*
title should be "Splat"
wait 0.5
click "Add Movie"
wait on response 500
fill element with id title "The Hateful Eight"
wait 0.5
fill element with id released "2015"
wait 0.5
released check regex "[15]"
wait 0.5
fill element with id director "Quentin Tarantino"
wait 0.5
director check regex "[Quentin]"
wait 0.5
fill element with id rating "R"
wait 0.5
fill element with id starring "Samuel Jackson, Kurt Russell"
wait 0.5
starring check regex "[J]"
wait 0.5
fill element with id duration "187"
wait 0.5
fill element with id genre "crime, drama"
wait 0.5
genre check regex "[a-r]"
wait 0.5
fill element with id synopsis "Description"
wait 0.5
fill element with id trailer "https://youtu.be/nIOmotayDMY"
click "Save Changes"
wait on response 500
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
wait 0.5
click "Splat!"
title should be "Splat"
wait 0.5
click "Browse Great Movies"
wait on response 500
click element with id "TheHatefulEight"
wait on response 500
click "Delete Movie"
wait on response 500
      */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },
    {
        name: 'CheckProperty',
        url: links.splat(),
        scenario:  (function () {/*
title should be "Splat"
wait 0.5
"nav-collapse" "className" property should be "collapse navbar-collapse"
wait 0.5
"singindrop" "contentEditable" property should be "inherit"
wait 0.5
"content" "font-size" property should be "14px"
wait 0.5
"content" "font-family" property should be "\'Helvetica Neue\', Helvetica, Arial, sans-serif"
wait 0.5
click "Browse Great Movies"
wait 0.5
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },
    {
        name: 'TestEndpoints',
        url: links.splat(),
        scenario:  (function () {/*
#Settings
wait between operations for 0.1 s
#Given
moviesEndpoint is 'http://localhost:41484/movies'
#Test
get endpoint moviesEndpoint should return status 200 content-type "application/json; charset=utf-8"
post endpoint moviesEndpoint data "{'title':'CSI: Las Vegas','director':'J.Bruckheimer','released':2010-01-01,'duration':186,'genre':'criminal','synopsis':'detective','freshTotal':'gfngf','freshVotes':100500,'poster':'csi-lv.jpg','dated':2010-01-01}" should return status 500
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim()
    },
    {
      name: 'SplatAddMovieByEndpoint',
      url: links.splat(),
      scenario:  (function () {/*
#Settings
wait between operations for 0.15 s
#Given
moviesEndpoint is 'http://localhost:41484/movies'
#Test
title should be "Splat"
wait 0.3
get endpoint moviesEndpoint should return status 200 content-type "application/json; charset=utf-8"
post endpoint moviesEndpoint data "{'title':'CSI','director':'Jerry Bruckheimer','released':2010-01-01,'duration':148,'genre':'criminal','synopsis':'not bad','freshTotal':50,'freshVotes':150,'poster':'csi.jpg','dated':2010-01-01, 'genre':['detective'],'starring':['John Smith, Vasyl Vasylenko, Rachel Tudor']}" should return status 200
click "Splat!"
title should be "Splat"
wait 0.5
click "Browse Great Movies"
wait 0.5
click element with id "CSI"
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
