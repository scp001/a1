var webdriver = require('../webdriver');

module.exports = function (app) {

  app.post('/runTest', function(req, res, next) {
      webdriver.test(req.body.address, req.body.command, function(err, extraMessage){
        if(!err) {
          res.header("Content-Type", "application/json");
          res.status(200).send({'status': 'OK'});
        } else {
          if(extraMessage){
            res.status(500).send({'status' : extraMessage});
          } else {
            res.status(500).send({'status' : 'Internal Server Error'});
          }
        }
    })
  });

};
