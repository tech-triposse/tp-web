var express = require('express');
var router = express.Router();

var dbConfig = require('../config/db.config');

router.get('/', function(req, res){
  res.render('corporate/corporate');
})

router.get('/register', function(req,res){
  dbConfig.connect(function(err){
    if(err) {
      throw err;
      res.send({success: false});
    }

    data = {
      name: req.body.name,
      companyName: req.body.companyName,
      companyCity: req.body.companyCity,
      email: req.body.email,
      number: req.body.number
    }

    dbConfig.db.collection('corporate').insert(data, function(err,result){
      if(err) {
        throw err;
        res.send({success: false});
      }

      res.send({success: true});
    })
  })
})

module.exports = router;
