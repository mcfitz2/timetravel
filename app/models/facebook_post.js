var mongoose = require('mongoose');
var FacebookPostSchema = mongoose.Schema({
    owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    id: String,
    from: { 
	name: String, 
	id: String 
    },
    message: String,
    updated_time: Date,
});



var FacebookPost = mongoose.model("FacebookPost", FacebookPostSchema);
module.exports = FacebookPost;