var LocalStrategy = require('passport-local').Strategy ;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectId;

var dbConfig = require('./db.config');
var authConfig = require('./auth.config');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    console.log("Serializing User");
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log("Deserializing user");
    done(null, user);
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },function(req, email, password, done){
    process.nextTick(function(){

      dbConfig.connect(function(err){
        if(err) throw err;

        dbConfig.db.collection("users").findOne({"email" : email }, function(err,user){
          if(err) throw (err);

          if(user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken'));
          }
          else{
            var newUser = {} ;
            newUser.email = email;
            newUser.password = generateHash(password);
            dbConfig.db.collection('users').insert(newUser, function(err,result){
              if(err) return done(null, false) ;
              else{
                return done(null, newUser);
              }
            });
          }
        });
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    dbConfig.connect(function(err){
      if(err) return done(err);

      dbConfig.db.collection('users').findOne({ 'email' : email }, function(err, user){
        if(err) return done(err);

        if(!user) return done(null, false, req.flash('loginMessage', 'No user found'));

        if(!validPassword(password, user.password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password'));

        return done(null, user);
      });
    });
  }));

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
var fbStrategy = authConfig.facebookAuth;
  fbStrategy.passReqToCallback = true;

  passport.use(new FacebookStrategy(fbStrategy,
    function(req, token, refreshToken, profile, done){
      process.nextTick(function(){
        dbConfig.connect(function(err){
          if(err) return done(err);

          dbConfig.db.collection('users').find({ id : profile.id }).toArray(function(err, user){
            if(err) return done(err);

            else if(user.length != 0){
              return done(null,user[0]);
            }
            else{
              var newUser = {};
              newUser.id = profile.id;
              newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.email = profile.emails[0].value;
              newUser.token = token;

              dbConfig.db.collection('users').insert(newUser, function(err, result){
                if(err) return done(err);

                return done(null, newUser);
              })
            }
          });
        });
      });
    }));

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================

    passport.use(new GoogleStrategy({
      clientID: authConfig.googleAuth.clientID,
      clientSecret: authConfig.googleAuth.clientSecret,
      callbackURL: authConfig.googleAuth.callbackURL,
      passReqToCallback: true
    }, function(req, token, refreshToken, profile, done){
      process.nextTick(function(){
        dbConfig.connect(function(err){
          if(err) return done(err);

          dbConfig.db.collection('users').find({ id : profile.id }).toArray(function(err, user){
            if(err) return done(err);

            else if(user.length != 0){
              return done(null,user[0]);
            }
            else{
              var newUser = {};
              newUser.id = profile.id;
              newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.email = profile.emails[0].value;
              newUser.token = token;

              dbConfig.db.collection('users').insert(newUser, function(err, result){
                if(err) return done(err);

                return done(null, newUser);
              })
            }
          });
        });
      });
    }));

}

var generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var validPassword = function(password, userPassword){
  return bcrypt.compareSync(password, userPassword);
}
