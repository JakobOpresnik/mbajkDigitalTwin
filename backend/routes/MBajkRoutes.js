var express = require('express');
var router = express.Router();
var MBajkController = require('../controllers/MBajkController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');


/**
 * GET
 */
router.get('/', MBajkController.list);
router.get('/closeTo', MBajkController.near);
router.get('/:id', MBajkController.show);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, MBajkController.insert);


module.exports = router;