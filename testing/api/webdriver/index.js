'use strict';

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var assert = require('assert');
var chakram = require('chakram');
var lodash = require('lodash');



webdriver.logging.installConsoleHandler();
webdriver.logging.getLogger().setLevel(webdriver.logging.Level.DEBUG);

//initialize webdriver engine and run a Selenium script <command>
function WebDriver() {}

WebDriver.prototype.test = function(address, command, callback) {
    console.log('Starting test. Address: ',address);
    if(address && command) {

        var scope = {
           wd: webdriver,
           chrome: chrome,
           callback: callback,
           assert: assert,
           chakram: chakram,
           expect: chakram.expect,
           _ : lodash,
           index : 1
        };

        var script = 'var driver = new scope.wd.Builder()' +
            '.usingServer().forBrowser("chrome").setChromeOptions()' +
            '.setControlFlow(new scope.wd.promise.ControlFlow().on("uncaughtException", function(err) { new Error(err.message) })).build();' +
            'driver.get(\'' + address + '\');' + command  + '.then(function(){ driver.sleep(2000); driver.wait(function(){driver.quit(); return scope.callback()}, 1000); })';

        var run = new Function('scope', script);
        run(scope);

    }
};

module.exports = new WebDriver();
