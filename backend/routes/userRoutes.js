var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var jwt = require("jsonwebtoken");

/**
 * @param req HTTP request
 * @param res HTTP response
 * @param next next function call
 * 
 * retrieves JWT token from the authorization header from the HTTP request
 * authorization header structure: Bearer token (split on first space)
 * if token is not null it is verified using the ACCESS_TOKEN_SECRET string
 * 
 * @returns error status code or the next function call
 */
function authenticateToken(req, res, next) {
    // get authentication header from HTTP request
    const authHeader = req.headers['authorization'];
    console.log("authHeader: " + authHeader);
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
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                // no access to the token
                return res.sendStatus(403);
            }
            // valid and accessible token
            req.user = user;
            console.log("token authentication successful")
            next();
        });
    }
}


/*
 * GET
 */
router.get('/getByToken', authenticateToken, userController.listByToken);   // user needs to have a JWT
router.get('/getAll', userController.list);
router.get('/logout/:username', userController.logout);
router.get('/:token', userController.show);

/*
 * POST
 */
router.post('/', userController.register);
router.post('/login', userController.login);

/*
 * DELETE
 */
router.delete('/:username', userController.remove);


module.exports = router;
