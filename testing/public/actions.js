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

function runTest()
{
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
