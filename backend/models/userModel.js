var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var bcrypt = require("bcrypt");

/**
 * definiton of userSchema attributes
 */
var userSchema = new Schema({
	'username' : {
		type : String,
		required : true
	},
	'password' : {
		type : String,
		required : true
	},
	'email' : {
		type : String,
		required : true
	},
	'admin' : {
		type : Boolean,
		default : false,
		required : false
	},
	'token' : {
		type : String,
		default : null,
		required : false
	}
}, {
	timestamps : true
});


/**
 * @param username username of the user we're authenticating
 * @param password password of the user we're authenticating
 * 
 * checks if there is a user with such a username in the database
 * afterwards it checks if the password is correct
 * @returns returns callback function with or without an error
 */
userSchema.statics.authenticate = function(username, password, callback) {
	User.findOne({username: username})
	.exec(function(err, user) {
		if (err) {
			return callback(err);
		}
		else if (!user) {
			var err = new Error("User not found");
			err.status = 401;
			return callback(err);
		}
		// if user is found in the database, we compare his password & the parameter password
		else {
			bcrypt.compare(password, user.password, function(err, result) {
				if (result == true) {
					return callback(null, user);	// error is null
				}
				else {
					return callback();
				}
			});
		}
	});
};

var User = mongoose.model("user", userSchema);
module.exports = mongoose.model('user', userSchema);

/*
{
	"username" : "Jakob",
	"password" : "jakob123",
	"email" : "jakob.opresnik@student.um.si",
	"admin" : true
}

{
	"username" : "Marko",
	"password" : "marko123",
	"email" : "marko.roskar@student.um.si",
	"admin" : true
}

{
	"username" : "Erik",
	"password" : "erik123",
	"email" : "erik.lasic@student.um.si",
	"admin" : true
}
*/