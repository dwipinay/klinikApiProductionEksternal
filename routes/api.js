const express = require('express')
const router = express.Router()

const token = require('../configs/Token')
const userController = require('../controllers/UserController')
const klinikController = require('../controllers/KlinikController')
const praktekMandiriController = require('../controllers/PraktekMandiriController')
const labKesController = require('../controllers/LabKesController')
const utdController = require('../controllers/UTDController')
const rumahSakitController = require('../controllers/RumahSakitController')

// Instance Class
const tokenObject = new token()
const userControllerObject = new userController()
const klinikControllerObject = new klinikController()
const praktekMandiriControllerObject = new praktekMandiriController()
const labKesControllerObject = new labKesController()
const utdControllerObject = new utdController()
const rumahSakitControllerObject = new rumahSakitController()

// Auth
router.post('/api/login',
    userControllerObject.authenticateIP,    
    userControllerObject.authenticateCredential)

// Klinik
router.get('/api/klinik',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    klinikControllerObject.index)

router.get('/api/klinik/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    klinikControllerObject.show)

// Praktek Mandiri
router.get('/api/praktekmandiri',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    praktekMandiriControllerObject.index)

router.get('/api/praktekmandiri/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    praktekMandiriControllerObject.show)

// Lab Kes
router.get('/api/labkes',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    labKesControllerObject.index)

router.get('/api/labkes/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    labKesControllerObject.show)

// UTD
router.get('/api/utd',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    utdControllerObject.index)

router.get('/api/utd/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    utdControllerObject.show)

// Rumah Sakit
router.get('/api/rumahsakit',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    rumahSakitControllerObject.index)

router.get('/api/rumahsakit/:id',
    userControllerObject.authenticateIP,
    tokenObject.authenticateToken,
    rumahSakitControllerObject.show)


router.use('/api', (req, res) => {
    res.status(404).send({
        status: false,
        message: 'page not found'
    });
})

module.exports = router