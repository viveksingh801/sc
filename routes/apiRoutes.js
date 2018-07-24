const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');


const apiController = require('../controllers/apiController')

router.post('/login', apiController.login)
router.get('/image/:image', apiController.image)

/**
 * Middleware for validity of token
 */
router.use( (req, res, next) =>  {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.APP_KEY, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.post('/json-patch', apiController.applyJsonPatch)
router.post('/create-thumbnail', apiController.thumbnail)

module.exports = router;