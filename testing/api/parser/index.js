'use strict';

function Parser() {}

var lcomand = {words : [], comand:''};

//builds commands for AI
var CommandBuilder = {

//test commands
  clickOn : function(element, selector){
    var command = '';
    if (element === "button"){
      command = CommandBuilder.eventsEmitter.buttonEvent("click", selector)  + '.then(function () {';
    }else{
      command = CommandBuilder.eventsEmitter.elementEvent(element, selector, "click")  + '.then(function () {';
    }
    return command;
  },

  doubleClickOn : function(element, selector){
    var command = '';
    if (element === "button"){
      command = CommandBuilder.eventsEmitter.buttonEvent("doubleClick", selector)  + '.then(function () {';
    }else{
      command = CommandBuilder.eventsEmitter.elementEvent(element, selector, "doubleClick")  + '.then(function () {';
    }
    return command;
  },

  fillWith : function(selector, value){
    var command = CommandBuilder.formsAction.fillWithValue(value,selector,"id")  + '.then(function () {';
    return command;
  },

  shouldBe : function(value1, value2){
    var command = 'if( \'' + value1 + '\' !== ' + '\''+ value2 + '\'' + ' ) throw \'values mismatch\';';
    return command;
  },

  waitFor : function(timeout){
    var command = CommandBuilder.timeManager.sleep(timeout);
    return command;
  },

  moveMouseTo : function(element){
    var command = '';
    command = CommandBuilder.findElementBy.Text(element)+'.then(function(el){ if(el) driver.mouseMove(el);})' + '.then(function () {';
    return command;
  },

  focusOn : function(element){
    var command = '';
    command =  CommandBuilder.findElementBy.Text(element) + '.then(function (el) { if(el) driver.move(el); }).then(function () {';
    return command;
  },

  submit : function(element, selector){
    var command = '';
    command = CommandBuilder.eventsEmitter.elementEvent("submit", selector, "value") + '.then(function () {';
    return command;
  },

  focusOn : function(elementId){
    var command = CommandBuilder.moveMouseTo(elementId);
    return command;
  },

  pressKey : function(key){
    //var command = 'driver.findElement(self.By.xpath("//body")).then(function(el){ if (el) el.sendKeys(\''+key+'\');}).then(function(){';
    var command = 'driver.keyDown('+ key +').then(driver.sleep(500)).then(function(){';
    return command;
  },

  radiogroupSelect : function(name, value){
    var command = CommandBuilder.findElementBy.Text(name) + '.then(function(el){ if(el) el.click(); driver.sleep(500);' +
                  CommandBuilder.findElementBy.Value(value)+ '.then(function(el){ if(el) el.click()}); }).then(function(){';
    return command;
  },

  selectFromDropdown : function(name, value){
    var command = '';
    command = CommandBuilder.findElementBy.Text(name) + '.then(function(el) { if(el) el.click(); driver.sleep(500);' +
              CommandBuilder.findElementBy.Value(value) + '.then(function(el) { if(el) el.click(); })).then( function(){';
    return command;

  },

  propertyShouldBe : function(element, propertyName, expectedValue){
    var assertion = 'if(value !== \''+ expectedValue +'\'){throw \'unexpected property value\'}';
    var command  = CommandBuilder.findElementBy.Id(element) +
    '.getAttribute(\''+propertyName+'\').then(function(value) {if(value) ' + assertion + ' }).then(function () {';

    return command;
  },

  waitOnResponse : function(time){
    var command = CommandBuilder.timeManager.waitUntilAjaxComplete(time);
    return command;
  },

  checkRegex : function(element, regex){
    var regexp = new RegExp(regex);
    var assertion = 'if(' + regexp + '.test(value)!==true){throw \'regex check failed\'}';
    var command = CommandBuilder.findElementBy.Id(element) + '.getAttribute(\'value\')' +
    '.then(function(value){ if(value) '+ assertion +' }).then(function(){'
    return command;
  },

  elementWithId : function(Id){
    var command = CommandBuilder.findElementBy.Id(Id);
    return command;

  },

//internal objects for forming commands
  elementsChecker : {
    titleShouldBe : function(value){
      return 'driver.getTitle().then(function(title) { if(title !== ' + '\''+value+'\'' +') throw\'titles mismatch\'; return true;}).then(function(){ ';
    },

    pageShouldContains : function(value){
      return CommandBuilder.findElementBy.Text(value)+'.then(function (el) { if(!el) throw \"page not contains: (' + value + ')\"}).then(function(){';
    }
  },

  eventsEmitter : {
    buttonEvent : function(eventType, buttonText){
      return CommandBuilder.findElementBy.ButtonText(buttonText)+ CommandBuilder.eventsEmitter.emitEvent(eventType);
    },

    elementEvent : function(eventType, value, selector){
      if (selector === "id")
       return CommandBuilder.findElementBy.Id(value) + CommandBuilder.eventsEmitter.emitEvent(eventType);
      if (selector === "text")
        return CommandBuilder.findElementBy.Text(value) + CommandBuilder.eventsEmitter.emitEvent(eventType);
      if (selector === "name")
        return CommandBuilder.findElementBy.Name(value) + CommandBuilder.eventsEmitter.emitEvent(eventType);
      if (selector === "value")
        return CommandBuilder.findElementBy.Value(value) + CommandBuilder.eventsEmitter.emitEvent(eventType);
    },

    emitEvent : function(eventType,parameter){
      var command = '';
      var parameters = '';
      if (parameter){
        parameters = parameter;
      }
      return '.then(function(el){ if(el) el.' + eventType +'('+parameters+'); }).then(function () {';
    }

  },

  findElementBy : {
    Id : function(value){
      return 'driver.findElement(self.By.xpath("//*[@id = \''+value+'\'' +']"))';
    },
    Name : function(value){
      return 'driver.findElement(self.By.name(\''+value+'\'))';
    },
    Text : function(value){
      return 'driver.findElement(self.By.xpath("//*[text()=\''+value+'\']"))';
    },
    Placeholder : function(value){
      return 'driver.findElement(self.By.xpath("//*[@placeholder=\''+value+'\']"))'
    },
    ButtonText : function(value){
      return 'driver.findElement(self.By.xpath("//button[text()=\''+value+'\']"))';
    },
    Value : function(value){
      return 'driver.findElement(self.By.xpath("//*[@value=\'' + value + '\']"))';
    }
  },

  formsAction : {
    fillWithValue : function (value, propertyValue, selector){
      if (selector === "Id"){
        return CommandBuilder.findElementBy.Id(propertyValue)+'.then(function(el){ if(el) el' + CommandBuilder.sendKeys(value);
      }
      if (selector === "placeholder"){
        return CommandBuilder.findElementBy.Placeholder(propertyValue)+'.then(function(el){ if(el) el' + CommandBuilder.sendKeys(value);
      }
    }
  },

  timeManager : {
    sleep : function(value){
      return 'driver.sleep('+value+'*1000).then(function(){ ';
    },

    wait : function(value){
      return 'driver.sleep('+value+'*1000);';
    },

    actionUntilTitleIs : function(action, condition){
      return 'driver.' + action + '(self.until.titleIs("' + condition + '"), 1000).then(function(){  ';
    },

    waitUntilAjaxComplete : function(timeout){
      return 'driver.wait(driver.executeScript("return jQuery.active == 0"), ' + timeout + ').then(function () {';
    }

  },

  sendKeys : function(keys){
    return '.sendKeys('+'\''+keys+'\''+');';
  },

  getValueAndCompare : function(keys){
    return '.getAttribute(\'value\').then(function(value){ if(value !==\''+keys+'\') throw \'values mismatch\';}).then(null, function(e){return callback(true, e.stack)})';
  },


//search command keywords in current line <input.words> and if founded, return this command
 findElement : function(input){
   var count = 0; //var for calculating words in human command
   var found = false; //found command indicator
   var words = input.words; //input human command
   var comand = input.comand; //output AI command

   //keywords in human language
   var controls = ['move', 'mouse', 'focus', 'press'];

   var assertion = ['property', 'should','check'];

   var events = ['click', 'doubleClick', 'change', 'blur', 'contextmenu', 'keydown', 'keypress', 'keyup', 'mouseenter', 'mouseDown',
       'mouseUp', 'mouseleave', 'mouseover', 'mouseMove', 'scroll', 'select', 'submit', 'hover', 'ready', 'resize'];

   var elements =  ['name', 'id', 'title', 'page', 'radiogroup', 'dropdown'];

   var forms = ['fill'];

   var time = ['wait'];

   //search commands by defined keywords

   if(assertion.indexOf(words[2]) > -1){
     if(words[2] === 'property'){
       comand += CommandBuilder.propertyShouldBe(words[0], words[1], words[5]);
       count += 6;
     }

     found = true;
   }
   if(assertion.indexOf(words[1]) > -1){
       if (words[1] === 'should' && elements.indexOf(words[0]) === -1){
         comand += CommandBuilder.shouldBe(words[0], words[2]);
         count += 4;
       }else{
         if(words[1] === 'check'){
           comand += CommandBuilder.checkRegex(words[0],words[3]);
           count += 3;
         }
       }

     found = true;
   }

   if(controls.indexOf(words[0]) > -1) {
      if(words[0] === 'move'){
         comand += CommandBuilder.moveMouseTo(words[3]);
         count += 4;
      }
      else if(words[0] === 'focus'){
        comand += CommandBuilder.focusOn(words[2]);
        count += 3;
      }else if(words[0] === 'press'){
          comand += CommandBuilder.pressKey(words[2]);
          count += 3;
      }

      found = true;
   }

   if(elements.indexOf(words[0]) > -1) {
       if(words[0] === 'submit'){
         comand += CommandBuilder.findElementBy.Id(word[4]) + CommandBuilder.emitEvent(words[0]);
         count += 5;
       }
       else if(words[0] === 'title') {
         if(words[1] === 'should')
          if(words[2] === 'be'){
           comand+= CommandBuilder.elementsChecker.titleShouldBe(words[3]);
           count+=4;
         }
       }
       else if(words[0] === 'page') {
           if(words[1] === 'should') {
               if(words[2] === 'contains') {
                   comand+= CommandBuilder.elementsChecker.pageShouldContains(words[3]);
                   count+=4;
               }
           }
       }
       else if(words[0] === 'dropdown'){
         comand += CommandBuilder.selectFromDropdown(words[1], words[3]);
         count += 4;
       }
       else if(words[0] === 'radiogroup'){
         comand += CommandBuilder.radiogroupSelect(words[1], words[3]);
         count += 4;
       }
       else {
           comand+= CommandBuilder.elementsChecker.findElementBy.Value(words[0]);
           count+=1;
       }

       found = true;
   }

   if(events.indexOf(words[0]) > -1) {
       if(words[1] === 'button'){
           comand += CommandBuilder.eventsEmitter.buttonEvent(words[0], words[2]);
           count+=3;
       } else if(words[1] === 'element'){
           if (words[2] === 'with'){
               if(words[3] === 'id'){
                   comand += CommandBuilder.eventsEmitter.elementEvent(words[0], words[4], "id");
                   count+=5;
               }
               if(words[3] === 'text'){
                 comand += CommandBuilder.eventsEmitter.elementEvent(words[0], words[4], "text");
                 count+=5;
               }
           }
       } else {
           comand += CommandBuilder.eventsEmitter.elementEvent(words[0],words[1],"text");
           count+=2;
       }

       found = true;
   }

   if(forms.indexOf(words[0]) > -1) {
       if(words[1] === 'element'){
           if (words[2] === 'with') {
               if(words[3] === 'id') {
                   comand += CommandBuilder.formsAction.fillWithValue(words[5], words[4],"Id");
                   count += 6;
               }
           }
       } else {
           comand+= CommandBuilder.formsAction.fillWithValue(words[2],words[1],"placeholder")
           count+=2;
       }

       found = true;
   }

   if(time.indexOf(words[0]) > -1) {
       if(words.length === 2){
           comand+= CommandBuilder.timeManager.sleep(words[1]);
           count+=2;
       } else {
         if(words.length === 4){
           comand += CommandBuilder.waitOnResponse(words[3]);
           count += 4;
         }else{
           comand+= CommandBuilder.timeManager.actionUntilTitleIs(words[0], words[4]);
           count+=5;
         }
       }
       found = true;
   }

   //return result
   return {
       comand: comand,
       words: words,
       count: count,
       found: found
   }
  },

  findByParam : function(input){

      var result = CommandBuilder.findElement(input);

      if(result.found){
          switch (result.words[2]) {
              case 'set':
                  result.comand+= CommandBuilder.sendKeys(result.words[3]);
                  result.count+=2;
                  break;
              case 'get':
                  result.comand+= CommandBuilder.getValueAndCompare(result.words[3]);
                  result.count+=2;
                  break;
              default:
                  input.words = [];
                  break;
          }
      }

      //check if words are correctly counted
      if (result.count==input.words.length) {
          input.words = [];
      }
      else{
          input.words = input.words.slice(result.count);
      }
      //add a separator \n for current command
      if(result.comand){
          input.comand = result.comand+'\n';
      }
  },

  //launch command search
  createComand : function(argument) {
      while (argument.words.length!=0) {
          CommandBuilder.findByParam(argument);
      }
  },

  //add closing brackets and timeout for all AI commands and return this commands
  finalize : function(command){
      var length = command.split(/\n/).length;
      for(var i = 0; i < length-1; i++) {
          command += ' }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() }) \n ';
      }
      return command;
  }

}



//parser initialize
Parser.prototype.start = function(str, callback) {

    lcomand.comand = '';
    var comands = str.split('\n');//every human command must be in single line
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
            CommandBuilder.createComand(lcomand);
        }
    }

    //forming command from input
    if(lcomand.comand){
        var res = 'var self = scope.wd; \n' + CommandBuilder.finalize(lcomand.comand);
        callback(null, res);
    }
    else {
        callback('Error');
    }
};

module.exports = new Parser();
