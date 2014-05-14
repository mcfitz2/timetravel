var mongoose = require('mongoose');
var LastFMPostSchema = mongoose.Schema({
    owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    date: Date,
    timestamp: Number,
    "tagcount" : Number,
    "name" : String,
    "duration" : Number,
    "image" : [
	{
            "#text" : String,
            "size" : String
	},
	{
            "#text" : String,
            "size" : String
	},
	{
            "#text" : String,
            "size" : String
	},
	{
            "#text" : String,
            "size" : String
	}
    ],
    "mbid" : String,
    "album" : {
	"position" : String,
	"name" : String
    },
    "artist" : {
	"url" : String,
	"name" : String,
	"mbid" : String
    },
    "playcount" : Number,
    "url" : String
});



var LastFMPost = mongoose.model("LastFMPost", LastFMPostSchema);
module.exports = LastFMPost;
