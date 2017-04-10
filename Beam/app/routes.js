//var User = require('./models/user');

module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/dash', function(req, res) {
        res.render('dash.ejs'); // load the dash.ejs file
    });

    app.get('/chat', function(req, res) {
        res.render('chat.ejs'); // load the dash.ejs file
    });

    /*	app.get('/bIndex.html', function (req, res) {
    	    res.sendFile(__dirname + '/wwwClient/bIndex.html');
    	});*/

    app.get('/bIndex', function(req, res) {
        console.log('fetching bIndex.ejs');
        res.render('pages/bIndex');
    });

    /*
    		app.get('/bIndex', function (req, res) {
    	      res.render('bIndex.ejs', { message: req.flash('loginMessage') });
    	});*/

    app.get('/dragobject.html', function(req, res) {
        res.sendFile(__dirname + '/wwwClient/dragobject.html');
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', { user: req.user });
    });

    app.get('/auth/beam', passport.authenticate('beam', { scope: ['chat:chat', 'chat:connect', 'chat:change_role', 'chat:poll_start', 'chat:remove_message', 'channel:follow:self', 'channel:update:self'] }));

    //app.get('/auth/beam/callback', 
    //  passport.authenticate('beam', { successRedirect: '/profile',
    //  failureRedirect: '/'
    //  }));

    app.get('/auth/beam/callback',
        passport.authenticate('beam', { failureRedirect: '/' }),
        function(req, res) {

            console.log('redirecting to page');
            // Successful authentication, redirect home.
            res.redirect('/bIndex');
            //   res.redirect('/dragobject.html');
        }
    );


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}