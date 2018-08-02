let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');
let fetch = require('isomorphic-fetch');
let mysql = require('mysql2');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rnbM!B/#3vLn',
  database: 'testdb'
});
let db = require('./models/index');

let indexRouter = require('./routes/index');
let signupRouter = require('./routes/signup');
let signinRouter = require('./routes/signin');
let techDiariesRouter = require('./routes/tech_diaries');
let communitiesRouter = require('./routes/communities');
let myPageRouter = require('./routes/mypage');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session, passport.initialize, passport.session
// must line up in sequence as below
app.use(session({
	secret: 'testing',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/tech_diaries', techDiariesRouter);
app.use('/communities', communitiesRouter);
app.use('/mypage', myPageRouter);

// authentication
passport.serializeUser(function(username, done) {
	console.log('serializeUser');
  connection.query('select * from users where user_name = "' + username + '";', function(err, user) {
    let userId = user[0].id;
    console.log(user[0].id);
  	done(null, userId); // to deserializeUser
  });
});

passport.deserializeUser(function(userId, done) {
	console.log('deserializeUser');
	done(null, {
    userId: userId
  });
});

passport.use(new LocalStrategy(
	{
		usernameField: 'user_name',
		passwordField: 'password'
	},
	function(username, password, done){
		connection.query('select * from users;', function(err, users) {
			// usernameもpasswordもユニーク前提
			let usernames = [];
			let passwords = [];
			for (i = 0; i < users.length; i++) {
				usernames.push(users[i].user_name);
				// input(type='password')で渡される値はstringのようなので、
				// データベースから取り出した値もstringにしています。
				let pw = users[i].password.toString();
        passwords.push(pw);
			}
      // console.log(username)
			// console.log(usernames);
      // console.log(password);
			// console.log(passwords);
			// console.log(usernames.includes(username));
			// console.log(passwords.includes(password));
			if (usernames.includes(username) && passwords.includes(password)) {
        return done(null, username); // to serializeUser
			}
			return done(null, false, {message: 'invalid'});
		});
	}
));

// signup時にsigninを実行したい
// 現状はsignupした後、signinページから入らないといけない
app.post('/signup', function(req, res, next){
  connection.query('select * from users;', function(err, users){
    connection.query('insert into users set ? ;', {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        created_at: new Date(),
        updated_at: new Date()
      },
      function(err, success){
        if (err == null) {
          res.redirect('/signin');
          // let newUserName = req.body.user_name;
          // let newUserPassword = req.body.password;
          // fetch('http://localhost:3000/signin',
          //   {
          //     method: 'POST',
          //     body: JSON.stringify({
          //       user_name: newUserName,
          //       password: newUserPassword
          //     }),
          //     headers : new Headers({
          //       "Content-type" : "application/json"
          //     })
          //   }
          // ).catch(function(e){
          //   console.log(e);
          // });
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.post('/signin',
	passport.authenticate('local',
		{
			failureRedirect: '/signin'
		}
	),
	function(req, res, next){
		fetch('http://localhost:3000/signin',
			{
				credentials: 'include'
			}
		).then(function(){
			res.redirect('/');
		}).catch(function(e){
			console.log(e);
		});
	}
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
