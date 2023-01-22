var express = require('express');
var router = express.Router();
var tourPathController = require('../controllers/tourPathController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');

/**
 * GET
 */
router.get('/', tourPathController.list);
router.get('/:id', tourPathController.show);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, tourPathController.create);

/**
 * DELETE
 */
router.delete('/', jwtAuth.authenticateToken, tourPathController.removeAll);


module.exports = router;
