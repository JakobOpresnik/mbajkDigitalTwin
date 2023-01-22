var express = require('express');
var router = express.Router();
var bikeShedController = require('../controllers/bikeShedController.js');

// authenticateToken function
const jwtAuth = require('../authenticateJWT.js');

/**
 * GET
 */
router.get('/', bikeShedController.list);
router.get('/:id', bikeShedController.show);
router.get('/closeTo', bikeShedController.near);

/**
 * POST
 */
router.post('/', jwtAuth.authenticateToken, bikeShedController.create);

/**
 * DELETE
 */
router.delete('/', jwtAuth.authenticateToken, bikeShedController.removeAll);


module.exports = router;
