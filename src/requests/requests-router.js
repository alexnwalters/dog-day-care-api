const express = require('express')
const RequestsService = require('./requests-services')
const requireAuth = require('../middleware/jwt-auth')
const path = require('path')

const requestsRouter = express.Router()
const jsonBodyParser = express.json()

requestsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {

        RequestsService.getCareRequests(
            req.app.get('db')
        )
            .then( requests => {
                res.status(200).json(requests.map(RequestsService.serializeRequest))
            })
            .catch(next)
    })

requestsRouter
    .route('/:request_id')
    .all(requireAuth)
    .all((req, res, next) => {
        RequestsService.getCareRequestById(
            req.app.get('db'),
            req.params.request_id
        )
            .then(request => {
                if (!request) {
                    return res.status(400).json({
                        error: { message: `Request doesn't exist`}
                    })
                }
                res.request = request
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.request)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { status } = req.body
        updateStatus = { status }

        RequestsService.updateRequest(
            req.app.get('db'),
            req.params.request_id,
            updateStatus
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .delete((req, res, next) => {

        RequestsService.deleteRequest(
            req.app.get('db'),
            req.params.request_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

requestsRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const { contact_name, email, phone, service, care_date, status, dog_name, breed, age_yrs, age_mos,
            sex, spayed, exam, vaccines, medical, prior_care, crate, escape, other_pets,
            aggression, growl, growl_other, bite, bite_details, children, visitors, absent } = req.body
        
        const newRequest = { contact_name, email, phone, service, care_date, status, dog_name, breed, age_yrs, age_mos,
            sex, spayed, exam, vaccines, medical, prior_care, crate, escape, other_pets,
            aggression, growl, growl_other, bite, bite_details, children, visitors, absent }
        
        for(const [key, value] of Object.entries(newRequest))
        if(value == null)
            return res.status(400).json({
                error: `Bad Request`
            })

        RequestsService.insertNewRequest(
            req.app.get('db'),
            newRequest
        )
            .then(request => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${request.id}`))
                .json(request)
            })
            .catch(next)
    })

module.exports = requestsRouter