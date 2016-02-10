var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();

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
