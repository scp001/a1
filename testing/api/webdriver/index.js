'use strict';

var webdriver = require('selenium-webdriver');

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);

function WebDriver() {}

WebDriver.prototype.test = function(address, command, options, callback) {

    if(address && command) {

        var scope = {
            wd: webdriver,
            callback: callback
        };

        var window = (options.closeWindow === 'true') ? "driver.quit();" : "";
        var script = 'var driver = new scope.wd.Builder().usingServer().forBrowser("chrome").setChromeOptions()' +
            '.setControlFlow(new scope.wd.promise.ControlFlow().on("uncaughtException", function(err) { new Error(err.message) })).build();' +
            'driver.get(\'' + address + '\');' + command  + '.then(function(){ driver.sleep(2000); driver.wait(function(){' + window + 'return scope.callback()}, 1000); })';

        var run = Function('scope', script);
        run(scope);

    }
};

module.exports = new WebDriver();