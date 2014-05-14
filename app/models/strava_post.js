var mongoose = require('mongoose');
var StravaPostSchema = mongoose.Schema({
    owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    duration_formatted: String,
    distance_mi: Number,
    id: Number,
    "resource_state": Number,
    "external_id": String,
    "upload_id": Number,
    "athlete": {
	"id": Number,
	"resource_state": Number
    },
    "name": String,
    "description": String,
    "distance": Number,
    "moving_time": Number,
    "elapsed_time": Number,
    "total_elevation_gain": Number,
    "type": String,
    "start_date": Date,
    "start_date_local": Date,
    "timezone": String,
    "start_latlng":[Number],
    "end_latlng": [Number],
    "location_city": String,
    "location_state": String,
    "location_country": String,
    "start_latitude": Number,
    "start_longitude": Number,
    "achievement_count": Number,
    "kudos_count": Number,
    "comment_count": Number,
    "athlete_count": Number,
    "photo_count": Number,
    "trainer": Boolean,
    "commute": Boolean,
    "manual": Boolean,
    "private": Boolean,
    "flagged": Boolean,
    "workout_type": Number,
    "gear": {
	"id": String,
	"primary": Boolean,
	"name": String,
	"distance": Number,
	"resource_state": Number
    },
    "average_speed": Number,
    "max_speed": Number,
    "calories": Number,
    "truncated": Number,
    "has_kudoed": Boolean
});



var StravaPost = mongoose.model("StravaPost", StravaPostSchema);
module.exports = StravaPost;