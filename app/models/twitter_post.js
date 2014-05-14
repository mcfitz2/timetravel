var mongoose = require('mongoose');
var TwitterPostSchema = mongoose.Schema({
    owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    created_at: Date,
    id: Number,
    id_str: String,
    text: String,
    source: String,
    truncated: Boolean,
    retweet_count: Number,
    favorite_count: Number,
    favorited: Boolean,
    retweeted: Boolean,
    lang: String,
    user: {},
    entities: {},
    retweeted_status:{},
    permalink: String
});



var TwitterPost = mongoose.model("TwitterPost", TwitterPostSchema);
module.exports = TwitterPost;