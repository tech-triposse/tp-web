var express = require('express');
var router = express.Router();

var upload = require('../bin/upload');
var dbConfig = require('../config/db.config');

router.get('/', function(req, res, next){
  var dbResult;
  var recentResult = [];

  dbConfig.connect(function(err){
    if(err) throw err ;

    dbConfig.db.collection('blog').find().toArray(function(err, result){
      dbResult = result;
      if(dbResult.length >= 5){
        for(var i=0; i<5; i++){
          var recentData = { }
          recentData.id = dbResult[i]._id;
          recentData.short = dbResult[i].short;
          recentData.date = dbResult[i].date;
          recentData.imagePath = dbResult[i].imagePath[0];
          recentResult.push(recentData);
        }
      }
      else{
        for(var i=0; i<dbResult.length; i++){
          var recentData = { }
          recentData.id = dbResult[i]._id;
          recentData.short = dbResult[i].short;
          recentData.date = dbResult[i].date;
          recentData.imagePath = dbResult[i].imagePath[0];
          recentResult.push(recentData);
        }
      }

      dbConfig.db.collection('tags').aggregate(
        {$group: { _id: '$tag', count: {$sum: 1}}},
        {$sort: {count: -1}}).toArray(function(err, result){
          console.log(result);
          var topTags;
          if(result.length > 10){
            topTags = result.slice(0,10);
          }
          else{
            topTags = result;
          }
          res.render('blog/blog',{
            result: dbResult,
            recent: recentResult,
            tags: topTags
          });
        });
    });
  });
});

router.get('/editor', function(req, res, next){
  res.render('blog/editor');
});

router.post('/editor/upload',function(req, res) {
  upload(req, res, function(err){
    if(err){
      return res.end("Something went wrong!");
    }
    var imagePath = [];
    req.files.forEach(function(imageFile){

      imagePath.push(imageFile.path.split('public')[1]);
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;

    var tags = [] ;
    var enteredTags = []
    enteredTags = req.body.tags.split(',');
    for(var i=0; i<enteredTags.length; i++){
      tags.push(enteredTags[i].trim());
    }
    console.log(tags);
    var data = {
      'title': req.body.title,
      'descp': req.body.desp,
      'short': req.body.short,
      'content': req.body.content,
      'imagePath': imagePath,
      'date': today,
      'tags': tags
    };
    dbConfig.connect(function(err){
      if(err) throw err ;

      dbConfig.db.collection('blog').save(data, function(err, result){
        if(err) console.log(err);
        else{
          console.log("Saved to database");
          res.redirect('/blog');
        }
      });
    });
    dbConfig.connect(function(err){
      if(err) throw err;
      else{
        tags.forEach(function(tag){
          var tagData = {
            tag: tag
          }
          dbConfig.db.collection('tags').save(tagData, function(err, result){
            if(err) console.log("Error2");
            console.log("Tag saved to database");
          });
        });
      }
    });
  });
});

router.get('/add', function(req, res){
  res.render('blog/add',{
    storyFlag: true
  });

});

router.post('/add/share', function(req,res){
  var data = {
    name : req.body.name,
    email : req.body.email,
    story : req.body.storydetails
  };
  dbConfig.connect(function(err){
    if(err) throw err;

    dbConfig.db.collection('user-story').insert(data, function(err, result){
      if(err) throw err;

      res.render('blog/add',{
        storyFlag: false
      });
    });
  });

})

module.exports = router;
