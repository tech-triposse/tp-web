var express = require('express');
var router = express.Router();

var dbConfig = require('../config/db.config');

router.get('/', function(req, res){
  dbConfig.connect(function(err){
    if(err) throw err;

    dbConfig.db.collection('hatke-stay').find().toArray(function(err, result){
      if(err) throw err;

      res.render('hatke-stay/stay', {
        stay: result
      })
    })
  })
})

module.exports = router;
