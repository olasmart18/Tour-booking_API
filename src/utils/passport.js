const localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
// Const statusCode = require("http-status");
const User = require('../models/usersModel');

// Create passort local strategy
const localPassport = async passport => {
	passport.use(
		new localStrategy(
			{usernameField: 'email'},
			async (email, password, done) => {
				const isUser = await User.findOne({email});
				if (!isUser) {
					return done(null, false, {
						message: 'user not found, please sign Up',
					});
				}

				// Check password matching with bcrypt
				try {
					const pwdMatch = bcrypt.compareSync(password, isUser.password);
					if (pwdMatch) {
						return done(null, isUser, {
							message: 'successfully logged in as ' + isUser.username,
						});
					}

					return done(null, false, {
						message: 'incorrect password or username',
					});
				} catch (err) {
					return done(null, false, {
						message: err.message,
					});
				}
			},
		),
	);

	// Serialize user
	passport.serializeUser((user, done) => done(null, user._id));

	// Deserialize user
	passport.deserializeUser(async (id, done) => {
		try {
			await User.findById(id).then(user => done(null, user));
		} catch (err) {
			return done(null, false, {
				message: err.message,
			});
		}
	});
};

// Passport Google strategy
const googlePassport = async passport => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.callbackURL,
				passReqToCallback: true,
			},
			async (request, accessToken, refreshToken, profile, done) => {
				const user = await User.findOne({googleId: profile.id});
				console.log(profile);
				if (user) {
					return done(null, user);
				}

				try {
					await new User({
						googleId: profile.id,
						role: 'user',
					})
						.save({validateBeforeSave: false}) // Allow user to register without checking other field
						.then(user => done(null, user));
				} catch (err) {
					return done(err, null);
				}
			},
		),
	);
	// Serialize user
	passport.serializeUser((user, done) => done(null, user._id));

	// Deserialize user
	passport.deserializeUser(async (id, done) => {
		try {
			await User.findById(id).then(user => done(null, user));
		} catch (err) {
			return done(null, false, {
				message: err.message,
			});
		}
	});
};

module.exports = {localPassport, googlePassport};
