var webdriver = require('selenium-webdriver');
var asyncEval = require('async-eval');

webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);

function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {

    if(address && command) {
        var scope = this;
        scope.webdriver = webdriver;
        var script = 'resolve(function(){ var driver = new this.wd.Builder().forBrowser("firefox")' +
            '.setControlFlow(new this.wd.promise.ControlFlow().on("uncaughtException", function(err) { return err })).build();' +
            'driver.get(\'' + address + '\');' + command  + ';driver.wait(function(){}, 25 * 1000); driver.quit();});';

             function resolve(callback) {
                 setTimeout(callback, 250);
             }

             var obj = { wd : scope.webdriver };

             var options = {
                 this : obj,
                 asyncFunctions: {
                     resolve: resolve
                 }
             };

            asyncEval(script, options , function(err){
                if(err) return callback(true, err.stack);
                return callback();
            });


    }
    else return callback(true, 'script or url is not defined');
};

module.exports = new WebDriver();