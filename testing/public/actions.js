function parse(){
    $.ajax({
        type: 'POST',
        url: '/parse',
        dataType: 'text',
        data: { 'data' : document.getElementById('humanArea').value},
        success: function(response){
            document.getElementById('aiArea').value = response;
        },
        error: function(response) {
            console.log(response);
        }
    });
}

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

function saveScenario(){
    var name = document.getElementById('scenario-name').value;
    var scenario = document.getElementById('humanArea').value;

    if(name && scenario) {
        $.ajax({
            type: 'POST',
            url: '/scenario',
            dataType: 'text',
            data: {
                name: name,
                text: scenario
            },
            success: function(response){
                document.getElementById('scenario-status').innerHTML = '<p  style="margin-bottom: 0; margin-top: 15px" class="alert alert-success">' + response + ' </p>';
                setTimeout(function(){ $('#close-modal-scenario').click(); document.getElementById('scenario-status').innerHTML = ''; document.getElementById('scenario-name').value = ''  }, 2000)
            },
            error: function(response) {
                document.getElementById('scenario-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-danger">' + 'Failed.'  + response.responseText + '</p>';
                setTimeout(function(){ $('#close-modal-scenario').click(); document.getElementById('scenario-status').innerHTML = ''; document.getElementById('scenario-name').value = '' }, 2000)
            }
        });
    }
    else {
        document.getElementById('scenario-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-warning"> Scenario name or text is not specified </p>';
    }
}

function newAccount(){
    var name = document.getElementById('acc-name').value;
    var username = document.getElementById('acc-username').value;
    var pwd = document.getElementById('acc-pwd').value;
    var role = document.getElementById('acc-role').value;

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
                document.getElementById('create-acc-status').innerHTML = '<p  style="margin-bottom: 0; margin-top: 15px" class="alert alert-success">' + response + ' </p>';
                setTimeout(function(){ $('#close-modal-acc').click(); document.getElementById('create-acc-status').innerHTML = ''; clearCreateAccForm() }, 2000)
            },
            error: function(response) {
                document.getElementById('create-acc-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-danger">' + 'Failed.'  + response.responseText + '</p>';
                setTimeout(function(){ $('#close-modal-acc').click(); document.getElementById('create-acc-status').innerHTML = ''; clearCreateAccForm()  }, 2000)
            }
        });
    }
    else {
        document.getElementById('create-acc-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-warning"> Scenario name or text is not specified </p>';
    }
}

function getScenarios(){
    $.ajax({
        type: 'GET',
        url: '/scenario',
        dataType: 'json',
        success: function(data){
            var arr = [];
            data.forEach(function(item){
                var resp = '<tr>' +
                '<td>' + item.name  + '</td>' +
                '<td>' + item.scenario + '</td>' +
                '<td> ' +
                    '<div class="btn btn-warning btn-custom"> <i class="fa fa-pencil"></i> </div> ' +
                    '<div class="btn btn-danger btn-custom" onclick="removeScenario(' + '\'' + item._id + '\'' + ')"> <i class="fa fa-trash"></i> </div>  ' +
                    '<div class="btn btn-success btn-custom" onclick="startScenario(' + '\'' + item._id + '\'' + ')"> <i class="fa fa-play"></i> </div> ' +
                    '</td></tr>';
                arr.push(resp);
            });
            document.getElementById('scenarios-grid').innerHTML = arr.toString().replace(/\,/g, '');
        },
        error: function(data) {
            console.log(data.responseText);
        }
    });
}

function startScenario(id) {
    $.ajax({
        type: 'POST',
        url: '/script',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(response){
            var body = response[0];
            document.getElementById('humanArea').value = body.scenario;
            document.getElementById('url').value = body.url;
            $('#parse').click();
            $('#close-modal-browse').click();
        },
        error: function(response) {
            console.log(response.responseText);
        }
    });
}


function removeScenario(id){
    $.ajax({
        type: 'DELETE',
        url: '/scenario',
        dataType: 'text',
        data: {
            id: id
        },
        success: function(response){
            getScenarios();
        },
        error: function(response) {
            alert(response.responseText);
        }
    });
}

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

function  saveTestResults(){
    var course = document.getElementById('course').value,
        scenario = document.getElementById('humanArea').value,
        result = document.getElementById('test-result').value,
        comment = document.getElementById('comment').value;

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
                document.getElementById('student-test-results').innerHTML = '<p  style="margin-bottom: 0; margin-top: 35px" class="alert alert-success">' + response + ' </p>';
                setTimeout(function(){ $('#close-modal-test-res').click(); }, 2000)
            },
            error: function(response) {
                document.getElementById('student-test-results').innerHTML = '<p style="margin-bottom: 0; margin-top: 35px" class="alert alert-danger">' + 'Failed.'  + response.responseText + '</p>';
                setTimeout(function(){ $('#close-modal-test-res').click(); }, 2000)
            }
        });
    }
}

function searchStudents(){
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
}


function restoreScenarios(){
    $.ajax({
        type: 'POST',
        url: '/restore',
        dataType: 'json',
        success: function(response){
            console.log(response);
        },
        error: function(response) {
            console.log(response.responseText);
        }
    });
}