module.exports = {
  'facebookAuth' : {
        'clientID'        : '815467568621744', // your App ID
        'clientSecret'    : '0f6ddb95e1cfdc9c2085e2d8ffa31db7', // your App Secret
        'callbackURL'     : 'http://www.triposse.com/auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
    },

    'googleAuth' : {
        'clientID'         : '998894781514-cs99b2v0bvt35d0bcadrg2ol72k6r62g.apps.googleusercontent.com',
        'clientSecret'     : 'f6OUK3CyxV-dgWNv1-zCMxUd',
        'callbackURL'      : 'http://www.triposse.com:3000/auth/google/callback'
    }
}
