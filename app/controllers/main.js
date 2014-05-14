var moment = require("moment");
var mongoose = require("mongoose");
var TwitterPost = mongoose.model("TwitterPost");
var FacebookPost = mongoose.model("FacebookPost");
var StravaPost = mongoose.model("StravaPost");
var LastFMPost = mongoose.model("LastFMPost");
var async = require("async");
function isAuthenticated (req, res, next){
    res.locals.today = moment().format("YYYY-MM-DD");
    res.locals.user = req.user._id;
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = function(app) {
    app.get('/', isAuthenticated, function(req, res) {
	res.redirect("/profile");
    });
    app.get('/profile', isAuthenticated, function(req, res){
	res.render('profile');
    });
    app.get("/date/:date", isAuthenticated, function(req, res) {
    	var datestr = req.params.date;	
	if (! req.params.date) {
	    datestr = moment().format("YYYY-MM-DD");
	}
	var date = moment(datestr, "YYYY-MM-DD").seconds(0).minutes(0).hours(0);
	var date2 = moment(date).seconds(0).minutes(0).hours(0).add("days", 1);
	console.log(moment(), date, date2);
	async.concat([{obj:TwitterPost, date_key:"created_at", provider:"twitter"}, 
		      {obj:FacebookPost, date_key:"updated_time", provider:"facebook"},
		      {obj:StravaPost, date_key:"start_date", provider:"strava"},
		      {obj:LastFMPost, date_key:"date", provider:"lastfm"}], function(object, callback) {
			  var query = {};
			  query[object.date_key] = {"$gte": date.toDate(), 
						    "$lt": date2.toDate()
						   };
			  object.obj.find(query, function(err, docs) {
			    //  console.log(query, err, docs);
			      async.map(docs, function(item, callback) {
				  item[object.provider] = true;
				  if (item.updated_time) {
				      console.log(item);
				      item.moment = moment(item.updated_time);
				  } else if (item.created_at) {
				      item.moment = moment(item.created_at);
				  } else if (item.start_date) {
				      item.moment = moment(item.start_date);
				  } else if (item.date) {
				      item.moment = moment(item.date);
				  }
				  item.date_formatted = item.moment.format("LLL");
				  callback(null, item);
			      }, function(err, results) {
				  callback(err, results);
			      });
			  });
		      }, function(err, docs) {
			  res.locals.events = docs.sort(function(a, b) {
			      if (a.moment.isBefore(b.moment)) {
				  return -1;
			      }
			      if (a.moment.isAfter(b.moment)) {
				  return 1;
			      }
			      return 0;
			  });
			  res.locals.date = date.format("MM/DD/YYYY");
			  res.locals.past = moment(date).subtract("days", 1).format("YYYY-MM-DD");
			  res.locals.future = moment(date).add("days", 1).format("YYYY-MM-DD");
			  res.locals.today = moment().format("MM/DD/YYYY");
			  res.locals.datestr = date.format("YYYY-MM-DD");
			  res.render("year", {partials:{tweet:"tweet.html", status:"status.html", activity:"activity.html", scrobble:"scrobble.html"}});
		      });
    });
};