var webdriver = require('selenium-webdriver');

function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {
    if(address && command) {
        var script = 'var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();' + 'driver.get(\'' + address + '\');'
            + command + 'driver.quit();';
        var run = Function('webdriver', script);
        run(webdriver);
        return callback();
    }
    else return callback(false);
};

module.exports = new WebDriver();