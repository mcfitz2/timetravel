var mongoose = require('mongoose');
var Moves = require('moves');
var bcrypt = require('bcrypt'), SALT_WORK_FACTOR = 10,     passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = mongoose.Schema({
    email:    {type:String, required:true},
    strava: {},
    instagram: {},
    foursquare: {},
    twitter:{},
    facebook:{}
});
UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findOrCreateOAuthUser = function(profile, done) {
    var User = this;
    console.log(profile);
    if (profile.provider == "strava") {
	return done(null, null);
    }
    // Build dynamic key query
    var query = {moves_id: profile.id};
    
    // Search for a profile from the given auth origin
    User.findOne(query, function(err, user){
	if(err) throw err;
	
	// If a user is returned, load the given user
	if(user){
	   User.update(user, {refresh_token : profile.refresh_token,
                              access_token: profile.access_token}, function(err, numAffected, rawResponse) {
				  done(null, user);
			      });
//	    done(null, user);
	} else {
	    // Fixed fields
	    user = {
		refresh_token : profile.refresh_token,
		access_token: profile.access_token
	    };
		
	    User.create(
		user,
		function(err, user){
		    if(err) throw err;
		    done(null, user);
		});
	}
    });
}

var User = mongoose.model("User", UserSchema);
module.exports = User;