const UTD = require('../models/UTD')
const pagination = require('../configs/Pagination')
const paginationDB = require('../configs/PaginationDB')
const Joi = require('joi')

class UTDController {
    index(req, res) {
        const schema = Joi.object({
            provinsiId: Joi.string().allow(''),
            kabKotaId: Joi.string().allow('').allow(null),
            nama: Joi.string().allow(''),
            page: Joi.number()
        })

        const { error, value } =  schema.validate(req.query)

        if (error) {
            res.status(400).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const UTDObject = new UTD()
        UTDObject.getAll(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            
            const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
            const remarkPagination = paginationDBObject.getRemarkPagination()
            const message = results.data.length ? 'data found' : 'data not found'

            res.status(200).send({
                status: true,
                message: message,
                pagination: remarkPagination,
                data: results.data
            })
        })
    }

    show(req, res) {
        const UTDObject = new UTD()
        UTDObject.show(req.params.id, req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const message = results.length ? 'data found' : 'data not found'
            const data = results.length ? results[0] : null

            res.status(200).send({
                status: true,
                message: message,
                data: data
            })
        })
    }
}

module.exports = UTDController