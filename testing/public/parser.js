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
        comand+='driver.getTitle().then(function(title) { return title === ' + '\''+words[3]+'\'' +';});';
        count+=4;
      }
      else {
        comand+='driver.findElement(webdriver.By.' + value + '(';
        count+=1;
      }

      found = true;
    }

    if(events.indexOf(value) > -1) {
      if(words[1] == 'button'){
        comand+='driver.findElement(webdriver.By.xpath("//button[text()='+ '\''+words[2]+'\'' +']")).' + value + '();';
        count+=3;
      } else {
        comand+='driver.findElement(webdriver.By.xpath("//*[text()='+ '\''+words[1]+'\'' +']")).' + value + '();';
        count+=2;
      }

      found = true;
    }

    if(forms.indexOf(value) > -1) {
        comand+='driver.findElement(webdriver.By.xpath("//*[@placeholder='+ '\''+words[1]+'\'' +']")).sendKeys("' + words[2] + '");';
        count+=2;

        found = true;
    }

    if(time.indexOf(value) > -1) {
        if(words.length == 2){
          comand+='driver.' + value + '(webdriver.until.elementLocated(webdriver.By.tagName(\'body\')), '+words[1]+' * 1000);';
          count+=2;
        } else {
          comand+='driver.' + value + '(webdriver.until.titleIs("' + words[4] + '"), 1000);';
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

function findByParam(input){

  var result = findElement(input);

  if(result.found){
    switch (result.words[2]) {
      case 'set':
        result.comand+='.sendKeys('+'\''+result.words[3]+'\''+');';
        result.count+=2;
        break;
      case 'get':
        result.comand+='.getAttribute(\'value\').then(function(value){ assert.equal(value, '+ '\''+result.words[3]+'\'' + ');});';
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
  document.getElementById('aiArea').value = argument.comand;
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