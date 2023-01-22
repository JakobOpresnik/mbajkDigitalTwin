var jwt = require("jsonwebtoken");
const UserModel = require('./models/userModel.js');

module.exports = {
    
    /**
     * @param req HTTP request
     * @param res HTTP response
     * @param next next function call
     * 
     * middleware function
     * 
     * retrieves JWT token from the authorization header from the HTTP request
     * authorization header structure: Bearer token (split on first space)
     * if token is not null the user to whom the JWT belongs is queried
     * his JWT is then verified using the ACCESS_TOKEN_SECRET string
     * 
     * @returns error status code or the next function call
     */
    authenticateToken: function(req, res, next) {
        // get authentication header from response
        const authHeader = req.headers['authorization'];
        console.log("authHeader: " + authHeader)
        var token;
        if (authHeader) {
            // get the token portion from the header (after 1st space)
            token = authHeader.split(" ")[1];
        }
        else {
            token = null;
        }

        // no token received
        if (token == null) {
            return res.sendStatus(401);
        }
        // token received
        else {
            // get user with given token
            UserModel.findOne({token: token}, function(err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user logged in'
                    });
                }
                console.log(user.token)
                // verify user's token
                jwt.verify(user.token, process.env.ACCESS_TOKEN_SECRET, (err, user_jwt) => {
                    // no access to the token, if user isn't logged in (token is null)
                    if (err || user.token == null) {
                        return res.sendStatus(403);
                    }
                    // valid and accessible token
                    req.user = user_jwt;
                    console.log("token authentication successful")
                    next();
                });
            });
            
        }
    }

}
