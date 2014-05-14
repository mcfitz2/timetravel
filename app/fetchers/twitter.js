var twitter = require('ntwitter');
var TwitterPost = require("mongoose").model("TwitterPost");
var async = require("async");
module.exports = function(app) {
    app.fetchers.twitter = function(user, callback) {
	console.log("USER", user);
	var twit = new twitter({
	    consumer_key: process.env.TWITTER_CLIENT_ID,
	    consumer_secret: process.env.TWITTER_CLIENT_SECRET,
	    access_token_key: user.twitter.access_token,
	    access_token_secret: user.twitter.refresh_token
	});

	var max_id = user.twitter.max_id || 1;
	var tweets = [];
	var items = -1;
	async.doWhilst(function(callback) {
	    var opts = {count:200, include_rts:true,exclude_replies:false};
	    if (items != -1) {
		opts.max_id = max_id;
	    }
	    twit.getUserTimeline(opts, function(err, reply) {
		if (err) {
		    return callback(err);
		}
		max_id = reply[reply.length-1].id;
		tweets = tweets.concat(reply);
		items = reply.length;
		callback();
	    });
	}, function() {
	    return items > 1;
	}, function(err) {
	    
	    if (err) {
		return callback(err, null);
	    }
	    console.log(tweets[0]);
	    async.eachLimit(tweets, 20, function(tweet, callback)  {
		tweet.owner = user._id;
		tweet.created_at = new Date(Date.parse(tweet.created_at));
		tweet.permalink = "https://twitter.com/"+tweet.user.screen_name+"/status/"+tweet.id;
		if (tweet.retweeted_status) {
		    tweet.text = "RT @"+tweet.retweeted_status.user.screen_name+": "+tweet.retweeted_status.text;
		}
//		var t = new TwitterPost(tweet);
		TwitterPost.update({owner:tweet.owner, id:tweet.id}, tweet, {upsert:true}, function(err, doc) {
		    callback(err);
		});
	    }, function(err) {
		callback(err);
	    });
	});
    };
};
