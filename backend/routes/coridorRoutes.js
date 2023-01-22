var express = require('express');
var router = express.Router();
var coridorController = require('../controllers/coridorController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');

/**
 * GET
 */
router.get('/', coridorController.list);
router.get('/:id', coridorController.show);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, coridorController.create);

/**
 * DELETE
 */
router.delete('/', jwtAuth.authenticateToken, coridorController.removeAll);


module.exports = router;
