var mongoose = require('mongoose')
, MovesStrategy = require('passport-moves').Strategy
, StravaStrategy = require('passport-strava').Strategy
, FacebookStrategy = require('passport-facebook').Strategy
, TwitterStrategy = require('passport-twitter').Strategy
, InstagramStrategy = require('passport-instagram').Strategy
, FoursquareStrategy = require('passport-foursquare').Strategy
, User = mongoose.model('User')
, LocalStrategy = require("passport-local").Strategy;
function callback(req, accessToken, refreshToken, profile, done) {
    profile.access_token = accessToken;
    profile.refresh_token = refreshToken;	
    User.findById(req.user._id, function(err, user) {
	delete profile._raw;
	delete profile._json;
	user[profile.provider] = profile;
	user.save(function(err) {
	    done(err);
	});
    });
    //done(null, profile);
}
module.exports = function (app) {
    app.passport.serializeUser(function(user, done) {
	done(null, user);
    });

    app.passport.deserializeUser(function(user, done) {
	done(null, user);
    });
    app.passport.serializeUser(User.serializeUser());
    app.passport.deserializeUser(User.deserializeUser());
    app.passport.use(new MovesStrategy({
	clientID: process.env.MOVES_CLIENT_ID,
	clientSecret: process.env.MOVES_CLIENT_SECRET,
	callbackURL: process.env.MOVES_CALLBACK_URL,
	passReqToCallback:true
    }, callback));
    app.passport.use(new StravaStrategy({
	clientID: process.env.STRAVA_CLIENT_ID,
	clientSecret: process.env.STRAVA_CLIENT_SECRET,
	callbackURL: process.env.STRAVA_CALLBACK_URL,
	passReqToCallback:true
    }, callback));
    app.passport.use(new InstagramStrategy({
	clientID: process.env.INSTAGRAM_CLIENT_ID,
	clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
	callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
	passReqToCallback:true
    }, callback));
    app.passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	passReqToCallback:true
    }, callback));
    app.passport.use(new TwitterStrategy({
	consumerKey: process.env.TWITTER_CLIENT_ID,
	consumerSecret: process.env.TWITTER_CLIENT_SECRET,
	callbackURL: process.env.TWITTER_CALLBACK_URL,
	passReqToCallback:true
    }, callback));
    app.passport.use(new FoursquareStrategy({
	clientID: process.env.FOURSQUARE_CLIENT_ID,
	clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
	callbackURL: process.env.FOURSQUARE_CALLBACK_URL,
	passReqToCallback:true
    }, callback));

    app.passport.use(User.createStrategy());
};
