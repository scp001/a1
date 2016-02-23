var webdriver = require('selenium-webdriver');

//webdriver.logging.installConsoleHandler();
//webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);


var scope = {};
scope.wd = webdriver;
scope.callback = function () {
  console.log('running callback with args::'+arguments);
};
var address = 'http://localhost:41484/index.html';
var driver = new scope.wd.Builder().usingServer().forBrowser("chrome").setChromeOptions().setControlFlow(new scope.wd.promise.ControlFlow().on("uncaughtException", function(err) { new Error(err.message) })).build();driver.get( address );
var self = scope.wd;



driver.getTitle().then(function(title) { return title === 'Splat';}).then(function(){
  return driver.sleep(0.5*1000);
}).then(function() {
  return driver.findElement(self.By.xpath("//*[text()='Add Movie']"));
}).then(function(el){ if(el) el.click();
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'title']"));
}).then(function(el){
  if(el) el.sendKeys("The Revenant");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'released']"))
}).then(function(el){
  if(el) el.sendKeys("2015");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'director']"))
}).then(function(el){
  if(el) el.sendKeys("Alejandro Iniarritu");
  return driver.sleep(0.5*1000)
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'rating']"));
}).then(function(el){
  if(el) el.sendKeys("R");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'starring']"));
}).then(function(el){
  if(el) el.sendKeys(" Leonardo DiCaprio, Tom Hardy");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'duration']"));
}).then(function(el){ if(el) el.sendKeys("154");
    return driver.sleep(0.5*1000)
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'genre']"));
}).then(function(el){
  if(el) el.sendKeys("adventure, drama");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'synopsis']"));
}).then(function(el){ if(el) el.sendKeys("Description");
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'trailer']"));
}).then(function(el){
  if(el) el.sendKeys("https://youtu.be/QRfj1VCg16Y");
  return driver.findElement(self.By.xpath("//*[text()='Save Changes']"));
}).then(function(el){
  if(el) el.click();
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[text()='Splat!']"));
}).then(function(el){
  if(el) el.click();
  return driver.getTitle();
}).then(function(title) {
  // something better?  
  // not sure if we do this:
  // return title === 'Splat' 
  // it will work properly
  // this function in theory should return only Promise object(an object that have )
  if(title === 'Splat'){
    return driver.sleep(1);
  } else {
     throw new Error(); // ???
  }
}).then(function(){
  return driver.sleep(0.5*1000);
}).then(function(){
  return driver.findElement(self.By.xpath("//*[text()='Browse Great Movies']"))
}).then(function(el){
  if(el) el.click();
  return driver.sleep(0.5*1000)
}).then(function(){
  return driver.findElement(self.By.xpath("//*[@id = 'TheRevenant']"));
}).then(function(el){
  if(el) el.click();
  return driver.sleep(0.5*1000)
}).then(function(){
  return driver.findElement(self.By.xpath("//*[text()='Delete Movie']"))
}).then(function(el){
  if(el) el.click();
}, function(err){
  scope.callback(true, err);
  driver.sleep(2000);
  return driver.quit()
}).then(function(){
  driver.sleep(2000);
  driver.wait(function(){
    driver.quit();
    return scope.callback()
  }, 1000);
});



/*
driver.getTitle().then(function(title) { return title === 'Splat';}).then(function(){
  driver.sleep(0.5*1000).then(function(){
    driver.findElement(self.By.xpath("//*[text()='Add Movie']")).then(function(el){ if(el) el.click();
      driver.sleep(0.5*1000).then(function(){
        driver.findElement(self.By.xpath("//*[@id = 'title']")).then(function(el){ if(el) el.sendKeys("The Revenant");
          driver.sleep(0.5*1000).then(function(){
            driver.findElement(self.By.xpath("//*[@id = 'released']")).then(function(el){ if(el) el.sendKeys("2015");
              driver.sleep(0.5*1000).then(function(){
                driver.findElement(self.By.xpath("//*[@id = 'director']")).then(function(el){ if(el) el.sendKeys("Alejandro Iniarritu");
                  driver.sleep(0.5*1000).then(function(){
                    driver.findElement(self.By.xpath("//*[@id = 'rating']")).then(function(el){ if(el) el.sendKeys("R");
                      driver.sleep(0.5*1000).then(function(){
                        driver.findElement(self.By.xpath("//*[@id = 'starring']")).then(function(el){ if(el) el.sendKeys(" Leonardo DiCaprio, Tom Hardy");
                          driver.sleep(0.5*1000).then(function(){
                            driver.findElement(self.By.xpath("//*[@id = 'duration']")).then(function(el){ if(el) el.sendKeys("154");
                              driver.sleep(0.5*1000).then(function(){
                                driver.findElement(self.By.xpath("//*[@id = 'genre']")).then(function(el){ if(el) el.sendKeys("adventure, drama");
                                  driver.sleep(0.5*1000).then(function(){
                                    driver.findElement(self.By.xpath("//*[@id = 'synopsis']")).then(function(el){ if(el) el.sendKeys("Description");
                                      driver.sleep(0.5*1000).then(function(){
                                        driver.findElement(self.By.xpath("//*[@id = 'trailer']")).then(function(el){ if(el) el.sendKeys("https://youtu.be/QRfj1VCg16Y");
                                          driver.findElement(self.By.xpath("//*[text()='Save Changes']")).then(function(el){ if(el) el.click();
                                          }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                                        }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                                      }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                                    }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                                  }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                                }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                              }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                            }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                          }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                        }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                      }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                    }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                  }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
                }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
              }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
            }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
          }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
        }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
      }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
    }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
  }, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
}, function(err){ scope.callback(true, err); driver.sleep(2000); return driver.quit() })
  .then(function(){ driver.sleep(2000); driver.wait(function(){driver.quit(); return scope.callback()}, 1000); });

*/


/*
// driver.get('http://localhost:4000/index.html');
// // driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
// // driver.findElement(webdriver.By.name('btnG')).click();
// console.log('found');
// driver.wait(function() {
//  return driver.getTitle().then(function(title) {
//    return title === 'Splat';
//  });
// }, 30000);
//
// driver.findElement(webdriver.By.id('clickid'));

//===========================
//GOOGLE TEST
driver.get('https://localhost:41484/index.html');
// driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
// driver.findElement(webdriver.By.name('btnG')).click();

// driver.findElement(webdriver.By.id('gb_70')).click();

var run = function(callback) {
    driver.findElement(webdriver.By.xpath("//*[text()='Sign Ufhfhfp']")).then(function (el) {
        callback();
    }, function (e) {
        callback(e)
    });
    driver.findElement(webdriver.By.xpath("//*[text()='Sign']"));
};
run(function(err){
    if(err) return console.log('ERROR');
    else console.log('OK');
});

//======================
//GITHUB TEST
// driver.get('http://www.github.com');
// // driver.findElement(webdriver.By.xpath("//button[contains(.,'Sign up')]")).click();
// driver.findElement(webdriver.By.xpath("//*[text()='Sign up']")).click();
// driver.wait(function() {
//  return driver.getTitle().then(function(title) {
//    return title === 'Join GitHub · GitHub';
//  });
// }, 1000);


driver.wait(function(){ driver.quit(); }, 4000);

*/

