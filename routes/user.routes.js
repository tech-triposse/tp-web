
var data = {}

module.exports = function(app, passport){

  app.get('/user/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }
      //if there is no user in the response send the info back to modal
      if (!user) {
        return res.send({valid : false});
      }
      //user was able to login, send true and redirect
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send({ valid: true });
      });
    })(req, res, next);
  });

  app.get('/user/signup', function(req,res){
    res.render('user/signup');
  });

  app.post('/user/signup', function(req, res){
    passport.authenticate('local-signup', function(err, user, info){
      if(err) return res.redirect('/user/signup');
      if(!user) return res.redirect('/user/signup');
      else{
        res.redirect('/');
      }
    })(req,res);
  });

  /*=====FACEBOOK ROUTES====*/
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/',
    failureRedirect: '/signup'
  }));

  /*=====GOOGLE ROUTES====*/
   app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

   app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/signup'
            }));

  app.get('/user/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}
