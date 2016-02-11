var webdriver = require('../webdriver');
var parser = require('../parser');

module.exports = function (app) {

  app.post('/runTest', function(req, res, next) {
      if(!req.body.address.trim() || !req.body.command.trim()){
        res.status(400).send('Script or url is not defined');
      }
      webdriver.test(req.body.address, req.body.command, req.body.options, function (err, message) {
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

  app.post('/parse', function(req, res, next){
      if(!req.body.data.trim()){
          res.status(400).send('Human text is not defined');
      }
      parser.start(req.body.data.trim(), function(err, data){
          res.header("Content-Type", "application/json");
          if (!err) {
              res.status(200).send(data);
          } else {
              res.status(500).send('500 Internal Server Error');
          }
      })
  });

};
