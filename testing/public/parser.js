var lcomand ={words : [], comand:''};

var findElement = function(input){
    var count = 0;
    var found = false;
    var words = input.words;
    var comand = input.comand;
    var value =  words[0];

    var events = ['click', 'dbclick', 'change', 'blur', 'focus', 'contextmenu', 'keydown', 'keypress', 'keyup', 'mouseenter', 'mousedown',
        'mouseup', 'mouseleave', 'mouseover', 'mousemove', 'scroll', 'select', 'submit', 'hover', 'ready', 'resize'];

    var elements =  ['name', 'id', 'title'];

    var forms = ['fill'];

    var time = ['wait'];

    if(elements.indexOf(value) > -1) {
        if(value === 'title') {
            comand+='driver.getTitle().then(function(title) { return title === ' + '\''+words[3]+'\'' +';}).then(function(){ ';
            count+=4;
        }
        else {
            comand+='driver.findElement(self.By.' + value + '(';
            count+=1;
        }

        found = true;
    }

    if(events.indexOf(value) > -1) {
        if(words[1] == 'button'){
            comand+='driver.findElement(self.By.xpath("//button[text()='+ '\''+words[2]+'\'' +']")).then(function(el){ el.' + value +'(); ';
            count+=3;
        } else {
            comand+='driver.findElement(self.By.xpath("//*[text()='+ '\''+words[1]+'\'' +']")).then(function(el){ el.' + value +'(); ';
            count+=2;
        }

        found = true;
    }

    if(forms.indexOf(value) > -1) {
        comand+='driver.findElement(self.By.xpath("//*[@placeholder='+ '\''+words[1]+'\'' +']")).sendKeys("' + words[2] + '").then(function(){ ';
        count+=2;

        found = true;
    }

    if(time.indexOf(value) > -1) {
        if(words.length == 2){
            comand+='driver.' + value + '(self.until.elementLocated(self.By.tagName(\'body\')), '+words[1]+' * 1000).then(function(){ ';
            count+=2;
        } else {
            comand+='driver.' + value + '(self.until.titleIs("' + words[4] + '"), 1000).then(function(){  ';
            count+=5;
        }
        found = true;
    }

    return {
        comand: comand,
        words: words,
        count: count,
        found: found
    }
};

var CompleteChain = function(command){
    var length = command.split(/\n/).length;
    for(var i = 0; i < length-1; i++) {
        command += ' }, function(err){ return callback(true, err.stack) }) \n '
    }
    return command;
};

function findByParam(input){

    var result = findElement(input);

    if(result.found){
        switch (result.words[2]) {
            case 'set':
                result.comand+='.sendKeys('+'\''+result.words[3]+'\''+');';
                result.count+=2;
                break;
            case 'get':
                result.comand+='.getAttribute(\'value\').then(function(value){ assert.equal(value, '+ '\''+result.words[3]+'\'' + ');}).then(null, function(e){return callback(true, e.stack)});';
                result.count+=2;
                break;
            default:
                input.words = [];
                break;
        }
    }

    if (result.count==input.words.length) {
        input.words = [];
    }
    else{
        input.words = input.words.slice(result.count);
    }
    if(result.comand){
        input.comand = result.comand+'\n';
    }
}

function parse() {
    lcomand.comand = '';
    var str = document.getElementById('humanArea').value;
    var comands = str.split('\n');
    for (var i = 0; i < comands.length; i++) {
        var lwords = comands[i].match(/(?:[^\s"]+|"[^"]*")+/g);
        if (!lwords) {
            continue;
        }
        //remove spaces and "
        for (var j = 0; j < lwords.length; j++) {
            lwords[j]=lwords[j].trim();
            if(lwords[j][0] == '\"' && lwords[j][lwords[j].length - 1] == '\"'){
                lwords[j] = lwords[j].substring(1, lwords[j].length - 1);
            }
        }
        if(lwords.length!=0){
            lcomand.words = lwords;
            createComand(lcomand);
        }
    }
}

function createComand(argument) {
    while (argument.words.length!=0) {
        findByParam(argument);
    }
    document.getElementById('aiArea').value = 'var self = this.wd; \n' + CompleteChain(argument.comand) + ';';
}


function runTest()
{
    $.post('/runTest',{
        address: document.getElementById('url').value,
        command: document.getElementById('aiArea').value
    }, function () {
        console.log("arguments:",arguments)
    });
}