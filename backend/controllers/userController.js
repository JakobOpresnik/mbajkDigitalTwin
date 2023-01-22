var UserModel = require('../models/userModel.js');

require("dotenv").config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { use, resource } = require('../app.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.listByToken()
     * @returns returns user with matching JWT compared to the JWT in authorization header
     */
    listByToken: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users.filter(user => user.username === req.user.username));
        });
    },

    /**
     * userController.list()+
     * @returns returns all existing users
     */
    list: function(req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     * @returns returns user with token given in the URL
     */
    show: function (req, res) {
        var token = req.params.token;

        UserModel.findOne({token: token}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.login()
     * checks for correctness of user's username and password (comparing with values from database)
     * generates JWT (JSON Web Token - long string based on user info) which serves much like a session
     * updates user record in database by adding the JWT
     * @returns returns message of successful login or error
     */
    login: function(req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function(err, user) {
            if (err || !user) {
                var error = new Error("Wrong username or password");
                error.status = 401;
                return next(error);
            }
            else {
                // create JWT token using the user's username, password and email address
                const accessToken = jwt.sign({ username: req.body.username, password: req.body.password, email: req.body.email }, process.env.ACCESS_TOKEN_SECRET);
                user.token = accessToken;

                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when adding token to user',
                            error: err
                        });
                    }

                    return res.status(200).json({
                        username: req.body.username,
                        accessToken: accessToken,
                        message: "login successful"
                    });
                });
            }
        });
    },

    /**
     * userController.logout()
     * finds user by username given in the URL
     * updates user record by setting the token to null again (user is logged out) - essentially deletes the JWT token
     * @returns returns message of (un)successful logout
     */
    logout: function(req, res) {
        UserModel.findOne({"username": req.params.username}, function(err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            };
            user.token = null;
            user.save(function(err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user',
                        error: err
                    });
                }
                return res.status(200).json({
                    message: "successfully logged out"
                });
            });
        });
    },

    /**
     * userController.register()
     * creates new user
     * hashes his password before saving to database
     * sets JWT (token) to null by default (user is not automatically logged in after registering)
     * @returns returns registered user
     */
    register: function (req, res) {
        bcrypt.hash(req.body.password, 10, function(err, hash) {	// salt - 10
            if (err) {
                return res.json(401).json({"message": "error hashing"});
            }

            var user = new UserModel({
                username : req.body.username,
                password : hash,    // hashed password
                email : req.body.email,
                token : null
            });
    
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }
    
                return res.status(201).json(user);
            });
        });

    },

    /**
     * userController.remove()
     * removes user from the database based on ID
     */
    remove: function (req, res) {
        var username = req.params.username;

        UserModel.findOneAndDelete(username, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    /**
     * userController.update()
     */
    /*update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
			user.admin = req.body.admin ? req.body.admin : user.admin;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    }*/

};
