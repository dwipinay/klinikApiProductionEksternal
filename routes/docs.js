const express = require('express')
const router = express.Router()

const swaggerUi = require('swagger-ui-express')
const apiDocs = require('../documentations/apiDocs-1.json')

router.use('/apidocs-1', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocs);
    res.send(html);
})

module.exports = router