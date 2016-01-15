// "id NAME set Igor id Surname get Igorenko name button click title GOOGLE";
/**
id NAME set Igor
id Surname get Igorenko
name button click
title GOOGLE

*/
// document.getElementById(23).value = 234;
function getCase(input) {
  var count =0;
  words = input.words;
  comand = input.comand;
  comand+='driver.findElement(wedbriver.By.';
}

function findByParam(input){
  var count =0;
  var find = false;
  words = input.words;
  comand = input.comand;
  switch (words[0]) {
    case 'name':
      comand+='driver.findElement(wedbriver.By.name(';
      find=true;
      count++;
      break;
    case 'id':
      comand+='driver.findElement(wedbriver.By.id(';
      find=true;
      count++;
      break;
    case 'title':
      comand+='driver.getTitle().then(function(title) { assertEquals(' + '\''+words[3]+'\'' +', title);});';
      count+=4;
      break;
    case 'click':
      comand+='driver.findElement(webdriver.By.xpath("//*[text()='+ '\''+words[1]+'\'' +']")).click();';
      count+=2;
      break;
    default:
        input.words = [];
      break;
  }
  if(find){
    comand+='\''+words[1]+'\''+'))';
    count++;
    switch (words[2]) {
      case 'set':
        comand+='.sendKeys('+'\''+words[3]+'\''+');';
        count+=2;
        break;
      case 'get':
        comand+='.getAttribute(\'value\').then(function(value){ assert.equal(value, '+ '\''+words[3]+'\'' + ');});';
        count+=2;
        break;
      default:
          input.words = [];
        break;
    }
  }
  // console.log(words);
  // console.log(count);
  if (count==input.words.length) {
      input.words = [];
  }
  else{
    input.words = input.words.slice(count);
  }
  if(comand){
    input.comand = comand+'\n';
  }
}

function parse(){
  var str = document.getElementById(23).value;
  console.log(str);
  var comands = str.split('\n');
  var lcomand ={words : [], comand:''}
  for (var i = 0; i < comands.length; i++) {
    var lwords = comands[i].match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!lwords) {
      continue;
    }
    //remove spaces and "
    for (var j = 0; j < lwords.length; j++) {
      lwords[j]=lwords[j].trim();
      if(lwords[j][0]=='\"' && lwords[j][lwords[j].length - 1] == '\"'){
          lwords[j]=lwords[j].substring(1, lwords[j].length - 1);
          console.log(lwords[j]);
      }
    }
    if(lwords.length!=0){
      lcomand.words = lwords;
      createComand(lcomand);
    }
  }
  console.log(lcomand.comand);
}
function createComand(argument) {
  console.log(argument.words);
  while (argument.words.length!=0) {
    findByParam(argument);
  }
  document.getElementById(24).value = argument.comand;
}
