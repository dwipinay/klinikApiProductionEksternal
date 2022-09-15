const express = require('express')
const router = express.Router()

const token = require('../configs/Token')
const userController = require('../controllers/UserController')
const klinikController = require('../controllers/KlinikController')

// Instance Class
const tokenObject = new token()
const userControllerObject = new userController()
const klinikControllerObject = new klinikController()

// Auth
router.post('/api/login',
    userControllerObject.authenticateIP,    
    userControllerObject.authenticateCredential)

// Praktek Mandiri
router.get('/api/klinik',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    klinikControllerObject.index)

router.get('/api/klinik/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    klinikControllerObject.show)

router.use('/api', (req, res) => {
    res.status(404).send({
        status: false,
        message: 'page not found'
    });
})

module.exports = router