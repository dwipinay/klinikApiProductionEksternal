require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRound = 10
const user = require('../models/User')
const jwt = require('jsonwebtoken')
const dateFormat = require("dateformat");
const Joi = require('joi')
const generatePassword = require('password-generator')

class userCredentialController {
    authenticateIP(req, res, next) {
        const requestIP = req.socket.remoteAddress.toString().replace('::ffff:', '')
        const userIPObject = new user()
        userIPObject.authenticateIP(requestIP, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(result.length) { 
                next()
            } else {
                res.status(403).send({
                    status: false,
                    message: `${requestIP} not registered`
                })
            }
        })
    }
    
    authenticateCredential(req, res) {
        const data = {
            userName: req.body.userName,
            password: req.body.password
        }
        
        const userObject = new user()
        userObject.authenticateCredential(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(!result.length) {
                res.status(401).send({
                    status:false,
                    message: "Unauthorized"
                })
                return
            }
            bcrypt.compare(req.body.password, result[0].password, (err2, res2) => {
                if(res2 == false) {
                    res.status(401).send({
                        status: false,
                        message: 'Unauthorized'
                    })
                    return;
                }
                // const user = JSON.parse(JSON.stringify(results[0]))
                const payloadObject = {
                    id: result[0].id,
                    user_name: result[0].user_name,
                    kode_rs: result[0].faskes_id
                }

                const accessToken = jwt.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
                    // console.log(result)
                    const refreshToken = jwt.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET)
                    const iat = dateFormat(new Date(result.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    const exp = dateFormat(new Date(result.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    res.status(201).send({
                        status: true,
                        message: "access token created",
                        data: {
                            access_token: accessToken,
                            issued_at: iat,
                            expired_at: exp,
                            expires_in: process.env.ACCESS_TOKEN_EXPIRESIN
                        }
                    })
                })
            })
        })
    }
}

module.exports = userCredentialController