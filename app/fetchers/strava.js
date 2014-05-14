var Strava = require('strava');
var StravaPost = require("mongoose").model("StravaPost");
var async = require("async");
module.exports = function(app) {
    app.fetchers.strava = function(user, callback) {
	console.log("USER",user);
	var strava = new Strava({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.STRAVA_CLIENT_SECRET,
            redirect_uri: process.STRAVA_CALLBACK_URL,
            access_token: user.strava.access_token,
            refresh_token: user.strava.refresh_token
        });
	strava.athlete.activities.get({paginate:true}, function(err, res) {
	    async.eachLimit(res, 20, function(activity, callback) {
		activity.distance_mi = Math.round((activity.distance*0.000621371) * 100) / 100;
		var seconds = Math.floor(activity.moving_time);
		var minutes = Math.floor(seconds/60);
		var hours = Math.floor(minutes/60);
		minutes = minutes-(hours*60);
		seconds = seconds-(hours*60*60)-(minutes*60);
		activity.duration_formatted = (hours>0 ? (hours+"h "):"")+(minutes > 0 ? (minutes+"m "):"")+(seconds>0 ? (seconds+"s"):"");
		activity.owner = user._id;
		activity.permalink = "http://app.strava.com/activities"+activity.id;
		StravaPost.update({owner:activity.owner, id:activity.id}, activity, {upsert:true}, function(err, doc) {
		    callback(err);
		});
	    }, function(err) {
		if (err) {
		    console.log(err);
		}
		callback(err);
	    });
	});

    };
};
