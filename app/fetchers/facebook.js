var FB = require('fbgraph');
var mongoose = require("mongoose");
var User = require("./../models/user.js");
var FacebookPost = require("mongoose").model("FacebookPost");
var async = require("async");

module.exports = function(app) {
    app.fetchers.facebook = function(user, callback) {
	FB.setAccessToken(user.facebook.access_token);
	var done = false;
	var statuses = [];
	var url = "me/statuses";
	async.doWhilst(function(callback) {
	    FB.get(url, function(err, res) {
		console.log(res.data);
		statuses = statuses.concat(res.data);
		if(res.paging && res.paging.next) {
		    url = res.paging.next;
		} else {
		    done = true;
		}
		callback();
	    });
	}, function() {
	    return !done;
	}, function(err) {
	    async.eachLimit(statuses, 20, function(status, callback)  {
		status.owner = user._id;
		status.updated_time = new Date(Date.parse(status.updated_time));
//		var t = new TwitterPost(tweet);
		FacebookPost.update({owner:status.owner, id:status.id}, status, {upsert:true}, function(err, doc) {
		    callback(err);
		});
	    }, function(err) {
		callback(err);
	    });
	});
	    
    };
};
