var express = require('express');
var router = express.Router();

var dbConfig = require('../config/db.config');

router.get('/', function(req, res, next) {
    var firstName;
    var stories = [];
    if(req.user)
      firstName = req.user.name.split(' ')[0];
    dbConfig.connect(function(err){
      if(err) throw err;
      dbConfig.db.collection('blog').find().limit(2).sort({$natural:-1}).toArray(function(err,result){
        result.forEach(function(data){
          var story = {};
          story.image = data.imagePath[0];
          story.title = data.title;
          stories.push(story);
        });
      });
      dbConfig.db.collection('hatke-stay').find( {rating: {$exists: true}} ).sort({rating : -1}).limit(3).toArray(function(err, result){

        res.render('index',{
          user: req.user,
          name: firstName,
          hatkeStays: result,
          stories: stories
        });
      });
    });
});

router.get('/gallery',function(req,res){
  dbConfig.connect(function(err){
    if(err) throw err;

    dbConfig.db.collection('blog').find().toArray(function(err, result){
        res.render('gallery',{
          data: result
        });
    });
  });
});

module.exports = router;
