var express = require('express');
var router = express.Router();
var standController = require('../controllers/standController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');

/**
 * GET
 */
router.get('/', standController.list);
router.get('/:id', standController.show);
router.get('/closeTo', standController.near);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, standController.create);

/**
 * DELETE
 */
router.delete('/', jwtAuth.authenticateToken, standController.removeAll);


module.exports = router;
