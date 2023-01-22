var express = require('express');
var router = express.Router();
var bikePathController = require('../controllers/bikePathController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');

/**
 * GET
 */
router.get('/', bikePathController.list);
router.get('/:id', bikePathController.show);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, bikePathController.create);

/**
 * DELETE
 */
router.delete('/', jwtAuth.authenticateToken, bikePathController.removeAll);


module.exports = router;
