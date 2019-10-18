const express = require('express')
const requestsService = require('./requests-services')

const requestsRouter = express.Router()

requestsRouter
    .route('/')
    .get((req, res, next) => {

        requestsService.getCareRequests(
            req.app.get('db')
        )
            .then( requests => {
                res.status(200).json(requests)
            })
            .catch(next)
    })

module.exports = requestsRouter