var webdriver = require('selenium-webdriver');

function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {
    if(address && command) {
        var script = 'var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();' + 'driver.get(\'' + address + '\');'
            + command + ';driver.wait(function(){}, 25 * 1000); driver.quit();';

        try{
            var run = Function('webdriver', script);
            run(webdriver);
        } catch (e){
            console.log(e);
            return callback(false, e.message);
        }

        return callback();
    }
    else return callback(false);
};

module.exports = new WebDriver();