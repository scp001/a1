'use strict';

/****************************************************************/
/*                display tests results                         */
/****************************************************************/
var testsMap = new Map();
var current = { provided: false, name: null, scenario: null };

function Tests(){
    this.runAll = function(){
        var result = { text : '-------------- tests --------------\n', total: { succed: 0, failed: 0 }};
        var total = 0;

        var limit = 1;
        var counter = 0;
        var pending = [];

        var addToSendQueue = function(test){
          var sent = sendIfPossible(test);
          if(!sent){
            pending.push(test);
          }
        }

        var sendNext = function(){
          var test = pending.shift();

          if(test){
            return sendIfPossible(test);
          }
          else {
            return true;
          }
        }

        var sendIfPossible = function(test){
          if (counter < limit) {
            socket.emit('run test', test);
            counter++;
            return true;
          }
          else {
            return false;
          }
        }

        testsMap.forEach(function(key, value){

          $.ajax({
              type: 'POST',
              url: '/parse',
              dataType: 'text',
              data: { 'data' : value},
              success: function(response){
                  addToSendQueue({
                    address: 'http://localhost:41484/index.html',
                    testname: key,
                    command: response
                  });
              },
              error: function(response) {
                  console.log(response);
              }
          });
        });

        socket.on('send status', function(response){
            total+=1;

            counter--;
            sendNext();

            if(response.code === 200) {
                result.text += response.testname + ': Success\n';
                result.total.succed+=1;
            }
            else {
                result.text += response.testname + ': Failed\n';
                result.total.failed+=1;
            }
        });

        socket.on('error', function(err){
            console.log('socket err');
            console.log(err);
        });

        var check = function(){
            if(total === testsMap.size){
                result.text+='-----------------------------------\n';
                result.text+='Total: ' + result.total.succed + ' Success / ' + result.total.failed + ' Fail';
                document.getElementById('status-field').innerHTML = '<pre>' + result.text + '<br/><a href="#" id="modal-save-all" data-toggle="modal" data-target="#modal-save-test-res">Save result</a>' + '</pre>';
                document.getElementById('test-result').value = result.text;

            }
            else {
                setTimeout(check, 1000); // check again in a second
            }
        };

        check();
    }
}


var tests = new Tests();
document.getElementById("runAll").addEventListener("click", function(){
  tests.runAll();
  $('#status-field').html('<p class="alert alert-info"> Pending... </p>');
});

//cookie parser
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

document.getElementById("humanArea").addEventListener("keyup", function(){
    var area = $('#humanArea').val(), scenario = $('#scenario'), save = $('#saveScenario'),
        remove = $('#removeScenario'), discard = $('#discard'), reset = $('#reset');
    var role = getCookie('role');
    if(role && role === 'admin' || role === 'checker') {

        area ? scenario.css('visibility', 'visible') && reset.css('visibility', 'visible')
             : scenario.css('visibility', 'hidden') && reset.css('visibility', 'hidden') ;
        current.provided ? scenario.css('visibility', 'visible')  : false;

        if (testsMap.has(area)) {
            remove.show();
            save.hide();
            discard.hide()
        }
        else {
            current.provided ? remove.show() : remove.hide();
            current.scenario ? discard.show() : discard.hide();
            save.show();
        }
    }
});


document.addEventListener("DOMContentLoaded", function(e) {
    var role = getCookie('role');
    var newScenario = $('#newScenario');
    (role && role === 'admin' || role === 'checker') ? newScenario.show() : newScenario.hide();
    getScenarios();
});


/****************************************************************/
/*                       ACTIONS                                */
/****************************************************************/

//"Generate test" click listener
document.getElementById('parse').addEventListener('click', function(){
    var data = document.getElementById('humanArea').value;

    if(data){
        $.ajax({
            type: 'POST',
            url: '/parse',
            dataType: 'text',
            data: { 'data' : data},
            success: function(response){
                document.getElementById('aiArea').value = response;
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
    else return false;
});

//run tests
var socket = io.connect('http://localhost:3000');
document.getElementById('run').addEventListener('click', function(){
    $('#status-field').html('<p class="alert alert-info"> Pending... </p>');

    socket.emit('run test', {
        address: document.getElementById('url').value,
        command: document.getElementById('aiArea').value
    });

    socket.on('send status', function(response){
        if(response.code === 200) {
            document.getElementById('status-field').innerHTML = '<p class="alert alert-success"> Success! ' + response.msg + '<a href="#" data-toggle="modal" data-target="#modal-save-test-res" style="float: right; color: #3c763d"> Click to save results </a>' + '</p>';
            document.getElementById('test-result').value = 'Success! ' + response.msg
        }
        else {
            document.getElementById('status-field').innerHTML = '<p class="alert alert-danger"> Failed! '  + '<a href="#" style="color: #BF360C"" onclick="alert(' + '\'' + response.msg.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/[^\w\s]/gi, '')  + '\'' + ')"> Show details </a>' + '<a href="#" data-toggle="modal" data-target="#modal-save-test-res" style="float: right; color: #BF360C"> Click to save results </a>' +'</p>';
            document.getElementById('test-result').value = 'Failed! ' + response.msg
        }
    });
});


/*
  // old server request
 function runTest() {
 document.getElementById('status-field').innerHTML = '<p class="alert alert-info"> Pending... </p>';

 $.ajax({
 type: 'POST',
 url: '/runTest',
 dataType: 'text',
 data: {
 address: document.getElementById('url').value,
 command: document.getElementById('aiArea').value,
 options: { closeWindow: document.getElementById("closeWindow").value}
 },
 success: function(response){
 document.getElementById('status-field').innerHTML = '<p class="alert alert-success"> Success!' + response + '<a href="#" data-toggle="modal" data-target="#modal-save-test-res" style="float: right; color: #009688"> Click to save results </a>' + '</p>';
 document.getElementById('test-result').value = 'Success!' + response
 },
 error: function(response) {
 document.getElementById('status-field').innerHTML = '<p class="alert alert-danger"> Failed! ' + response.status + '<a href="#" style="color: #BF360C"" onclick="alert(' + '\'' + response.responseText.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/[^\w\s]/gi, '')  + '\'' + ')"> Show details </a>' + '<a href="#" data-toggle="modal" data-target="#modal-save-test-res" style="float: right; color: #BF360C"> Click to save results </a>' +'</p>';
 document.getElementById('test-result').value = 'Failed!' + response.status + ' ' + response.responseText.substring(0, response.responseText.indexOf("(Session"))
 }
 });
 }

 // Modal window
 function getScenarios(){
 $.ajax({
 type: 'GET',
 url: '/scenario',
 dataType: 'json',
 success: function(data){
 var arr = [];
 data.forEach(function(item){
 var data =  item._id + '&#44; ' + item.url;
 var resp = '<tr>' +
 '<td>' + item.name  + '</td>' +
 '<td id=' + '\'' + item._id + '\'' + '>' + item.scenario  + '</td>' +
 '<td> ' +
 '<div class="btn btn-warning btn-custom" onclick="editScenario(' + '\'' + item._id + '\'' + ')"> <i class="fa fa-pencil"></i> </div> ' +
 '<div class="btn btn-danger btn-custom" onclick="removeScenario(' + '\'' + item._id + '\'' + ')"> <i class="fa fa-trash"></i> </div>  ' +
 '<div class="btn btn-success btn-custom" onclick="startScenario(' + '\'' + data + '\'' + ')"> <i class="fa fa-play"></i> </div> ' +
 '</td></tr>';
 arr.push(resp);
 });
 document.getElementById('scenarios-grid').innerHTML = arr.toString().replace(/\,/g, '');
 },
 error: function(data) {
 console.log(data.responseText);
 }
 });
 } */

//Create new scenario
document.getElementById('newScenario').addEventListener('click', function(){
    var humanArea = document.getElementById('humanArea').value;
    var confirmed = humanArea.trim() && !testsMap.has(humanArea) ?
        confirm('Are you sure? Changes will be discarded.') : true;

    if(confirmed) {
        reset();
    }
});

document.getElementById('account-save').addEventListener('click', function(){
    var name = document.getElementById('acc-name').value;
    var username = document.getElementById('acc-username').value;
    var pwd = document.getElementById('acc-pwd').value;
    var role = document.getElementById('acc-role').value;

    function clearCreateAccForm(){
        $('#acc-name').val('');
        $('#acc-username').val('');
        $('#acc-pwd').val('');
        $('#acc-role').val('none');
    }

    if(name && username && pwd && role && role!=='none'){
        var newUser = {
            name : name,
            username: username,
            password: pwd,
            role: role
        };

        $.ajax({
            type: 'POST',
            url: '/account',
            dataType: 'text',
            data: {
                user: newUser
            },
            success: function(response){
                $('#close-modal-acc').click();
                clearCreateAccForm();
                Notify(response, null, null, 'success');
            },
            error: function(response) {
                $('#close-modal-acc').click();
                clearCreateAccForm();
                Notify(response.responseText, null, null, 'danger');
            }
        });
    }
    else {
        document.getElementById('create-acc-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-warning"> Scenario name or text is not specified </p>';
    }
});

//scenario actions
function getScenarios(){
    $.ajax({
        type: 'GET',
        url: '/scenario',
        dataType: 'json',
        success: function(data){
            var arr = [];
            testsMap.clear();
            data.forEach(function(item){
                var name =  item.name;
                var selector = item.name.replace(/ /g, "");
                testsMap.set(item.scenario, selector);
                var resp = '<a href="javascript:;" id='+ '\'' + selector + '\'' + ' onclick="startScenario(' + '\'' + name + '\'' + ')">'  + item.name  + '</a>';
                arr.push(resp);
            });
            document.getElementById('provided-scenarios').innerHTML = arr.toString().replace(/\,/g, '');
        },
        error: function(data) {
            console.log(data.responseText);
        }
    });
}

function startScenario(name) {
    var role = getCookie('role');
    if (role && role === 'admin' || role === 'checker') {
        var humanArea = document.getElementById('humanArea').value;
        var confirmed = humanArea.trim() && !testsMap.has(humanArea) && !(current.name === name) ?
            confirm('Are you sure? Changes will be discarded.') : true;
    }

    if(confirmed || role==='student') {
        reset();
        $.ajax({
            type: 'POST',
            url: '/script',
            dataType: 'json',
            data: {
                name: name
            },
            success: function(response){
                document.getElementById('humanArea').value = response[0].scenario;
                document.getElementById('url').value  = response[0].url;
                if (role && role === 'admin' || role === 'checker') {
                    current = {
                        provided: true,
                        name: response[0].name,
                        scenario: response[0].scenario
                    };
                    $('#test-header').text('Update ' + '[' + response[0].name + ']' + ' test:');
                    $('#scenario-name').val(response[0].name).prop('disabled', true);
                    $('#scenario').css('visibility', 'visible');
                    $('#reset').css('visibility', 'visible');
                    $('#saveScenario').hide();
                    $('#discard').hide();
                    $('#removeScenario').show();
                }
            },
            error: function(response) {
                console.log(response.responseText);
            }
        });
    }
}

document.getElementById('scenario-save').addEventListener('click', function(){
    var name = current.provided ? current.name : document.getElementById('scenario-name').value.trim();
    var scenario = document.getElementById('humanArea').value.trim();
    var url = document.getElementById('url').value.trim();

    if(name && scenario && url) {

        var type = current.provided ? 'PUT' : 'POST';

        $.ajax({
            type: type,
            url: '/scenario',
            dataType: 'text',
            data: {
                name: name,
                text: scenario,
                url: url
            },
            success: function(response){
                getScenarios();
                current = {
                    provided: true,
                    name: name,
                    scenario: scenario
                };
                $('#close-modal-scenario').click();
                Notify(response, null, null, 'success');
                setTimeout( function(){ var id = name.replace(/ /g, ''); if(id) document.getElementById(id).click() }, 250);
            },
            error: function(response) {
                $('#close-modal-scenario').click();
                Notify(response.responseText, null, null, 'danger');
            }
        });
    }
    else {
        Notify('Scenario name, text or url is not specified', null, null, 'danger');
    }
});

document.getElementById('removeScenario').addEventListener('click', function(){
    var confirmed = confirm('Are you sure?');

    if (confirmed) {
        if (current.provided) {
            $.ajax({
                type: 'DELETE',
                url: '/scenario',
                dataType: 'text',
                data: {
                    scenario: current.scenario
                },
                success: function(response){
                    if(response) getScenarios();
                    reset();
                    Notify(response, null, null, 'success');
                },
                error: function(response) {
                    Notify(response.responseText, null, null, 'danger');
                }
            });
        }
    }
});

//students actions
function getStudents(filter){

    function render(data){
        var arr = [];
        data.forEach(function(item){

            var resp = '<tr>' +
                '<td>' + item.student.name  + '</td>' +
                '<td>' + item.student.course + '</td>' +
                '<td style="max-width: 300px">' + item.scenario + '</td>' +
                '<td style="max-width: 300px">' + item.result + '</td>' +
                '<td>' + item.comment + '</td>' +
                '</tr>';
            arr.push(resp);
        });
        document.getElementById('students-grid').innerHTML = arr.toString().replace(/\,/g, '');
    }

    if(filter) return render(filter);
    else {
        $.ajax({
            type: 'GET',
            url: '/students',
            dataType: 'json',
            success: function(data){
                render(data);
            },
            error: function(data) {
                console.log(data.responseText);
            }
        });
    }
}

document.getElementById('save-test-results').addEventListener('click', function(){
    var course = document.getElementById('course').value,
        scenario = document.getElementById('humanArea').value,
        result = document.getElementById('test-result').value,
        comment = document.getElementById('comment').value;

    function clearSaveTestFields(){
        $('#course').val('');
        $('#comment').val('');
    }

    if(!course || !scenario || !result) return false;
    else {
        var test = {
            student: {
                course: course
            },
            scenario: scenario,
            result: result,
            comment: comment
        };
        $.ajax({
            type: 'POST',
            url: '/students',
            dataType: 'text',
            data: {
                test: test
            },
            success: function(response){
                $('#close-modal-test-res').click();
                clearSaveTestFields();
                Notify(response, null, null, 'success');
            },
            error: function(response) {
                $('#close-modal-test-res').click();
                clearSaveTestFields();
                Notify(response.responseText, null, null, 'danger');
            }
        });
    }
});

document.getElementById('search-students').addEventListener('keyup', function(){
    var input = document.getElementById('search-students').value;
    if(!input) return getStudents();
    $.ajax({
        type: 'POST',
        url: '/search',
        dataType: 'json',
        data: {
            name: input
        },
        success: function(response){
            getStudents(response);
        },
        error: function(response) {
            console.log(response.responseText);
        }
    });
});


function restoreScenarios(){
    $.ajax({
        type: 'POST',
        url: '/restore',
        dataType: 'text',
        success: function(response){
            if(response) getScenarios();
            Notify(response, null, null, 'success');
        },
        error: function(response) {
            Notify(response.responseText, null, null, 'danger');
        }
    });
}

//set human and AI fields empty, testing url to default value
function reset(){
    var fields = ['humanArea', 'aiArea', 'url'];

    fields.forEach(function(item){
        var value = '';
        if(item === 'url') value = 'https://www.google.ca/';
        document.getElementById(item).value = value;
    });

    current = {
        provided: false,
        name: null,
        scenario: null
    };

    $('#test-header').text('Write your test:');
    $('#scenario-name').val('').prop('disabled', false);
    $('#scenario').css('visibility', 'hidden');
    $('#reset').css('visibility', 'hidden');
    $('#status-field').html('');
}

//action for reset button
document.getElementById('reset').addEventListener('click', function(){
    reset()
});

//"discard changes" button click
document.getElementById('discard').addEventListener('click', function(){
    var discard = current.scenario;
    if(discard) {
        document.getElementById('humanArea').value = discard;
        $('#discard').hide();
        $('#saveScenario').hide();
        $('#reset').css('visibility', 'visible');
    }
});
