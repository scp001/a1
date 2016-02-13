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
            document.getElementById('status-field').innerHTML = '<p class="alert alert-success"> Success! ' + response + '</p>';
        },
        error: function(response) {
            document.getElementById('status-field').innerHTML = '<p class="alert alert-danger"> Failed! ' + response.status + ' ' + response.responseText + '</p>';
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
                document.getElementById('scenario-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-danger">' + 'Failed.'  + response + '</p>';
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
                document.getElementById('create-acc-status').innerHTML = '<p style="margin-bottom: 0; margin-top: 15px" class="alert alert-danger">' + 'Failed.'  + response + '</p>';
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
            alert(response);
        }
    });
}

function getStudents(){
    $.ajax({
        type: 'GET',
        url: '/students',
        dataType: 'json',
        success: function(data){
           console.log(data);
        },
        error: function(data) {
            console.log(data.responseText);
        }
    });
}