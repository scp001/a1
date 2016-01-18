var webdriver = require('selenium-webdriver');


module.exports = function (app) {
  app.post('/runTest', function(req, res, next) {
    // console.log(req.body);
    var test ='var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();' + 'driver.get(\'' + req.body.adress + '\');' + req.body.comand + 'driver.quit();';
    var fn = Function('webdriver',test);
    fn(webdriver);
  });
}
