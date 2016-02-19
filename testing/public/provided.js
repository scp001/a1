'use strict';

var Immutable = require('immutable');
var testsMap = Immutable.Map();


function Tests(){
    this.runAll = function(){
        //var result = { text : '-------------- tests --------------\n', total: { succed: 0, failed: 0 }};
        //var total = 0;
        console.log(testsMap);
        //testsMap.forEach(function(item) {
        //    console.log(item);
            //document.getElementById(item).click();

            //$.ajax({
            //    type: 'POST',
            //    url: '/parse',
            //    dataType: 'text',
            //    data: { 'data' : document.getElementById('humanArea').value},
            //    success: function(response){
            //       if(response)
            //           socket.emit('run test', {
            //           address: document.getElementById('url').value,
            //           command: response
            //       });
            //    },
            //    error: function(response) {
            //        console.log(response.responseText);
            //    }
            //});
        //});

        //var check = function(){
        //    if(total === testsIds.length){
        //        result.text+='-----------------------------------\n';
        //        result.text+='Total: ' + result.total.succed + ' Success / ' + result.total.failed + ' Fail';
        //        document.getElementById('status-field').innerHTML = '<pre>' + result.text + '</pre>' + '<br/><a href="#" id="modal-save-all" data-toggle="modal" data-target="#modal-save-test-res"> </a>';
        //        document.getElementById('test-result').value = result.text;
        //    }
        //    else {
        //        setTimeout(check, 1000); // check again in a second
        //    }
        //};
        //
        //check();
    }
}


var tests = new Tests();
document.getElementById("runAll").addEventListener("click", function(){tests.runAll()});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

document.getElementById("humanArea").addEventListener("keyup", function(){
    var area = $('#humanArea').val(), scenario = $('#scenario');
    var role = getCookie('role');
    if(role && role === 'admin' || role === 'checker') {
        area.trim().length > 5 ? scenario.css('visibility', 'visible') : scenario.css('visibility', 'hidden');
    }
});

$( 'a[name=test]' ).on( "click", function() {
    var area = $('#humanArea').val(), scenario = $('#scenario');
    var role = getCookie('role');
    if(role && role === 'admin' || role === 'checker') {
        area.trim().indexOf('\n') > -1 ? scenario.css('visibility', 'visible') : scenario.css('visibility', 'hidden');
    }
});

document.addEventListener("DOMContentLoaded", function(e) {
    getScenarios();
});