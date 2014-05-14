try {
    var LastFMPost = require("mongoose").model("LastFMPost");
} catch(err) {
    var LastFMPost = require("../models/lastfm_post.js");
}    
var async = require("async");
var request = require("request");
var moment = require("moment");
var fetch = function(app) {
    app.fetchers.lastfm = function(user, callback) {
	console.log("USER", user);
	var url = "http://ws.audioscrobbler.com/2.0/";
	var params = {
            method:"user.getrecenttracks",
            user:user.lastfm.username,
            api_key:process.env.LASTFM_CLIENT_ID,
            format:"json",
            limit:200,
	    from:0,
	    page:1
	
	};
	var tracks = [];
	var done = true;
	request.get({url:url, json:true, qs:params}, function(err, res, body) {
	    if (err == null && body.recenttracks != undefined && body.recenttracks.track != undefined) {
		console.log(body);
		var pages = function() {
		    var foo = [];
		    for (var i = 1; i <= parseInt(body.recenttracks["@attr"].totalPages); i++) {
			foo.push(i);
		    }
		    return foo;
		}();
		async.eachSeries(pages, function(page, callback) {
		    console.log("REquesting", page);
		    params.page = page;
		    request.get({url:url, json:true, qs:params}, function(err, res, body) {
			if (err == null && body.recenttracks != undefined && body.recenttracks.track != undefined) {		
			    if (body.recenttracks.track.length == 0) {
				done = false;
			    } else {
				async.eachLimit(body.recenttracks.track, 20, function(track, callback) {
				    track.artist = track.artist["#text"];
				    track.timestamp = parseInt(track.date.uts);
				    track.date = new Date(track.timestamp*1000);
				    track.owner = user._id;
				    LastFMPost.update({owner:track.owner, timestamp:track.timestamp, name:track.name, artist:track.artist}, track, {upsert:true}, function(err, doc) {
					callback(err);
				    });
				}, function(err) {
				    callback(err);
				});
			    }
			} 
			console.log(body);
			return callback(err);
		    });
		}, function(err) {
//		    console.log(tracks);
		    callback(err, tracks);
		});
	    }
	});
    };
};
module.exports = fetch;
if (module === require.main) {
    console.log("TESTING");
    var User = require("../models/user.js");
    var mongoose = require("mongoose");
    var app = {fetchers:{}};
    fetch(app);
//    console.log(app);
    
    mongoose.connect(process.env.DB_URL);
    User.findOne({email:"mcfitz2@gmail.com"}, function(err, user) {
//	console.log(err, user);
	app.fetchers.lastfm(user, function(err) {
	    console.log(err);
	});
    });
}