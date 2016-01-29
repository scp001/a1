var webdriver = require('../webdriver');

module.exports = function (app) {

  app.post('/runTest', function(req, res, next) {
      if(!req.body.address.trim() || !req.body.command.trim()){
        res.status(400).send('Script or url is not defined');
      }
      webdriver.test(req.body.address, req.body.command, function (err, message) {
        res.header("Content-Type", "application/json");
        if (!err) {
          res.status(200).send('200 OK');
        } else {
          if (message) {
            res.status(400).send(message.message);
          } else {
            res.status(500).send('500 Internal Server Error');
          }
        }
      })
  });

};
