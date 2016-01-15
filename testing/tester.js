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
driver.get('http://www.google.com.ua');
// driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
// driver.findElement(webdriver.By.name('btnG')).click();

// driver.findElement(webdriver.By.id('gb_70')).click();

driver.findElement(webdriver.By.xpath("//*[text()='Увійти']")).click();
driver.wait(function() {
 return driver.getTitle().then(function(title) {
   return title === 'Вхід – Облікові записи    Google';
 });
}, 1000);

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



driver.quit();
