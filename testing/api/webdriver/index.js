'use strict';

var webdriver = require('selenium-webdriver');
var assert = require('assert');
var chakram = require('chakram');
var _ = require('lodash');



webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);

//initialize webdriver engine and run a Selenium script <command>
function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {

    if(address && command) {

        var scope = {
           wd: webdriver,
           callback: callback,
           assert: assert,
           chakram: chakram,
           expect: chakram.expect,
           _ : _
        };

        var script = 'var driver = new scope.wd.Builder().usingServer().forBrowser("chrome").setChromeOptions()' +
            '.setControlFlow(new scope.wd.promise.ControlFlow().on("uncaughtException", function(err) { new Error(err.message) })).build();' +
            'driver.get(\'' + address + '\');' + command  + '.then(function(){ driver.sleep(2000); driver.wait(function(){driver.quit(); return scope.callback()}, 1000); })';

        var run = Function('scope', script);
        run(scope);

    }
};

module.exports = new WebDriver();
