var links = (function () {
    var splatLink = 'http://localhost:41484/index.html';
    return {
        splat: function(){
            return splatLink;
        }
    };
})();

function SplatTests(){
    this.generate = function(text){
        document.getElementById('url').value = links.splat();
        document.getElementById('humanArea').value = text;
    };
    this.runAll = function(){
        var testsIds = ['splatReg', 'splatAuth', 'splatOrderMoviesByTitle', 'splatOrderMoviesByDirector', 'splatAddDeleteMovie', 'splatAddUpdateDeleteMovie', 'splatAddComment'];
        var result = { text : '-------------- tests --------------\n', total: { succed: 0, failed: 0 }};
        var total = 0;
        testsIds.forEach(function(item) {
            document.getElementById(item).click();

            $.ajax({
                type: 'POST',
                url: '/parse',
                dataType: 'text',
                data: { 'data' : document.getElementById('humanArea').value},
                success: function(response){
                    $.ajax({
                        type: 'POST',
                        url: '/runTest',
                        dataType: 'text',
                        data: {
                            address: links.splat(),
                            command: response,
                            options: {closeWindow: 'true'}
                        },
                        success: function (response) {
                            total += 1;
                            result.total.succed += 1;
                            result.text += item + ': Success\n';
                        },
                        error: function (response) {
                            total += 1;
                            result.total.failed += 1;
                            result.text += item + ': Fail\n';
                        }
                    });
                },
                error: function(response) {
                    console.log(response);
                }
            });
        });

        var check = function(){
            if(total === testsIds.length){
                result.text+='-----------------------------------\n';
                result.text+='Total: ' + result.total.succed + ' Success / ' + result.total.failed + ' Fail';
                document.getElementById('status-field').innerHTML = '<pre>' + result.text + '</pre>' + '<br/><a href="#" id="modal-save-all" data-toggle="modal" data-target="#modal-save-test-res"> </a>';
                document.getElementById('test-result').value = result.text;
                $('#modal-save-all').click();
            }
            else {
                setTimeout(check, 1000); // check again in a second
            }
        };

        check();
    }
}

SplatTests.prototype.testReg = function(){

    this.generate((function () {/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.testAuth = function(){

    this.generate((function () {/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.addMovie = function(){

    this.generate((function (){/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.updateMovie = function(){

    this.generate((function (){/*
     title should be "Splat"
     wait 0.5
     click "Browse Great Movies"
     wait 0.5
     click element with id "TheBigShort"
     wait 0.5
     fill element with id synopsis " summary"
     wait 0.5
     click "Save Changes"
     click "Save Changes"
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.deleteMovie = function() {

    this.generate((function () {/*
         title should be "Splat"
         wait 0.5
         click "Browse Great Movies"
         wait 0.5
         click element with id "TheBigShort"
         wait 0.5
         click "Delete Movie"
         */
        }).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.orderMoviesByTitle = function(){

    this.generate((function (){/*
         title should be "Splat"
         wait 0.5
         click "Browse Movies"
         wait 0.5
         click element with id byTitle
         wait 0.5
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.orderMoviesByDirector = function(){

    this.generate((function (){/*
         title should be "Splat"
         wait 0.5
         click "Browse Movies"
         wait 0.5
         click element with id byDirector
         wait 0.5
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.addDeleteMovie = function(){

    this.generate((function (){/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.addUpdateDeleteMovie = function() {

    this.generate((function (){/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.addComment = function(){

    this.generate((function (){/*
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
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim());
};

SplatTests.prototype.runAll = function(){
    this.runAll();
};

/*******************************************************************/
/*                      Splat Tests                                */
/*******************************************************************/

var splat = new SplatTests();
//document.getElementById("splatReg").addEventListener("click", function(){splat.testReg()});
//document.getElementById("splatAuth").addEventListener("click", function(){splat.testAuth()});
////document.getElementById("splatAddMovie").addEventListener("click", function(){splat.addMovie()});
////document.getElementById("splatUpdateMovie").addEventListener("click", function(){splat.updateMovie()});
////document.getElementById("splatDeleteMovie").addEventListener("click", function(){splat.deleteMovie()});
//document.getElementById("splatOrderMoviesByTitle").addEventListener("click", function(){splat.orderMoviesByTitle()});
//document.getElementById("splatOrderMoviesByDirector").addEventListener("click", function(){splat.orderMoviesByDirector()});
//document.getElementById("splatAddDeleteMovie").addEventListener("click", function(){splat.addDeleteMovie()});
//document.getElementById("splatAddUpdateDeleteMovie").addEventListener("click", function(){splat.addUpdateDeleteMovie()});
//document.getElementById("splatAddComment").addEventListener("click", function(){splat.addComment()});
//document.getElementById("splatAll").addEventListener("click", function(){splat.runAll()});

/*******************************************************************/
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function clearCreateAccForm(){
    $('#acc-name').val('');
    $('#acc-username').val('');
    $('#acc-pwd').val('');
    $('#acc-role').val('none');
}

document.getElementById("humanArea").addEventListener("keyup", function(){
    var area = $('#humanArea').val(), scenario = $('#scenario');
    var role = getCookie('role');
    if(role && role === 'admin' || role === 'checker') {
        area.trim().indexOf('\n') > -1 ? scenario.css('visibility', 'visible') : scenario.css('visibility', 'hidden');
    }
});

$( 'a[name=test]' ).on( "click", function() {
    var area = $('#humanArea').val(), scenario = $('#scenario');
    var role = getCookie('role');
    if(role && role === 'admin' || role === 'checker') {
        area.trim().indexOf('\n') > -1 ? scenario.css('visibility', 'visible') : scenario.css('visibility', 'hidden');
    }
});