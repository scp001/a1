function Roles(){}

Roles.prototype.resolve = function(role){
    var menu = '', createOptions = '';
    if(role && (role === 'admin' || role === 'checker')){
        menu =  '<li><a href="#" data-toggle="modal" data-target="#modal-account">Create account</a></li>' +
            '<li><a href="#" data-toggle="modal" data-target="#modal-students" onclick="getStudents()"> Search students </a></li>' +
            '<li><a href="#" onclick="restoreScenarios()"> Restore default scenarios </a> </li>';

        if(role === 'admin') {

            createOptions = '<option value="admin"> Administrator </option>' +
                            '<option value="checker"> Checker </option>' +
                            '<option value="student"> Student </option>'
        }
        if(role === 'checker') {

            createOptions = '<option value="student"> Student </option>'
        }
    }
    else if(role && role === 'student') {
        menu = '<li><a href="#" data-toggle="modal" data-target="#modal-students" onclick="getStudents()"> Search students </a></li>'+
            '<li><a href="#" onclick="restoreScenarios()"> Restore default scenarios </a> </li>';
    }
    return {
        menu: menu,
        createOptions: createOptions
    };
};

exports.Roles = new Roles();