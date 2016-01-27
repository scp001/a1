var webdriver = require('selenium-webdriver');

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);

function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {

    if(address && command) {

        var scope = {
            wd: webdriver,
            callback: callback
        };

        var script = 'var driver = new scope.wd.Builder().forBrowser("chrome")' +
            '.setControlFlow(new scope.wd.promise.ControlFlow().on("uncaughtException", function(err) { new Error(err) })).build();' +
            'driver.get(\'' + address + '\');' + command  + '.then(function(){ return scope.callback() }).then(function(){ driver.wait(function(){}, 1000); driver.quit(); })';

        var run = Function('scope', script);
        run(scope);

    }
    else return callback(true, 'script or url is not defined');
};

module.exports = new WebDriver();