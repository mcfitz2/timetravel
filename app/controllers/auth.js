var mongoose = require("mongoose");
var User = mongoose.model("User");

function isAuthenticated (req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = function(app) {

    app.get('/login', function(req, res){
	res.locals.user = req.user;
	res.render('login');
    });

    app.get("/register", function(req, res) {
	res.render("register");
    });
    app.post('/register', function(req, res) {
	User.register(new User({ username : req.body.username, email:req.body.email }), req.body.password, function(err, account) {
            if (err) {
		return res.render('register', { account : account });
            }
            app.passport.authenticate('local')(req, res, function () {
		res.redirect('/profile');
            });
	});
    });
    app.post('/login', app.passport.authenticate('local'), function(req, res) {
	res.redirect('/profile');
    });

    app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
    });
    
    app.get('/auth/moves', isAuthenticated, 
	    app.passport.authorize(
		'moves',
		{
		    scope: "location activity"
		})
	   );
    
    app.get('/auth/moves/callback', isAuthenticated,
	    app.passport.authorize('moves', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });

    app.get('/auth/facebook', isAuthenticated, 
	    app.passport.authorize(
		'facebook',
		{
//		    scope: "location activity"
		    scope:"email,user_birthday,user_location,user_about_me,user_status"
		})
	   );
    
    app.get('/auth/facebook/callback', isAuthenticated,
	    app.passport.authorize('facebook', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });
    app.get('/auth/twitter', isAuthenticated,
	    app.passport.authenticate(
		'twitter',
		{

		})
	   );
    
    app.get('/auth/twitter/callback', isAuthenticated, 
	    app.passport.authenticate('twitter', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });

    app.get('/auth/strava', isAuthenticated, 
	    app.passport.authorize(
		'strava',
		{
		    scope: "view_private write"
		})
	   );
    
    app.get('/auth/strava/callback', isAuthenticated, 
	    app.passport.authorize('strava', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });
    app.get('/auth/instagram', isAuthenticated, 
	    app.passport.authorize(
		'instagram',
		{
//		    scope: "view_private write"
		})
	   );
    
    app.get('/auth/instagram/callback', isAuthenticated, 
	    app.passport.authorize('instagram', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });

    app.get('/auth/foursquare', isAuthenticated, 
	    app.passport.authorize(
		'foursquare',
		{
//		    scope: "location activity"
		})
	   );
    
    app.get('/auth/foursquare/callback', isAuthenticated, 
	    app.passport.authorize('foursquare', { failureRedirect: '/' }),
	    function(req, res) {
		console.log(req.user);
		res.redirect('/profile');
	    });
};