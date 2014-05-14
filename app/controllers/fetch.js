var mongoose = require("mongoose");
var User = mongoose.model("User");
var TwitterPost = mongoose.model("TwitterPost");
var async = require("async");
function isAuthenticated (req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = function(app) {
    app.get('/fetch/strava', isAuthenticated, function(req, res){
        app.fetchers.strava(req.user, function(err) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    });
    app.get('/fetch/lastfm', isAuthenticated, function(req, res){
        app.fetchers.lastfm(req.user, function(err) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    });
    app.get('/fetch/twitter', isAuthenticated, function(req, res){
	app.fetchers.twitter(req.user, function(err) {
	    if (err) {
		res.send(500);
	    } else {
		res.send(200);
	    }
	});
    });
    app.get('/fetch/facebook', isAuthenticated, function(req, res){
	app.fetchers.facebook(req.user, function(err) {
	    if (err) {
		res.send(500);
	    } else {
		res.send(200);
	    }
	});
    });
};
