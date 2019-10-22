const app = require('../src/app')
const knex = require('knex')
const { expect } = require('chai')
const helpers = require('./test-helpers')

describe('Requests Endpoints', function() {
    let db

    const {
        testUsers,
        testCareRequests,
        testNewRequests,
    } = helpers.makeRequestFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE admin_users, care_requests RESTART IDENTITY CASCADE'))

    describe('Request exists', () => {
        beforeEach('insert requests', () => 
            helpers.seedTables(
                db,
                testUsers,
                testCareRequests
            )
        )

        afterEach('cleanup',() => db.raw('TRUNCATE admin_users, care_requests RESTART IDENTITY CASCADE'))

        context('GET /api/requests', () => {              
            it('responds with 200 and all of the requests', () => {
                const expectedRequests = helpers.makeExpectedRequests(testCareRequests)

                return supertest(app)
                    .get(`/api/requests`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedRequests)
            })
        })

        context('GET /api/requests/:request_id', () => {
            it(`responds with 200 and expected request`, () => {
                const expectedRequests = testCareRequests
                const request_id = 2

                return supertest(app)
                    .get(`/api/requests/${request_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedRequests[request_id - 1])
            })
        })

        context('PATCH /api/requests/:request_id', () => {                
            it(`responds with 204, and correctly updated status`, () => {
                const request_id = 2
                const updatedStatus = {
                    status: 'Accepted'
                }
                const expectedRequest = {
                    ...testCareRequests[request_id - 1],
                    ...updatedStatus
                }

                return supertest(app)
                    .patch(`/api/requests/${request_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updatedStatus)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/requests/${request_id}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedRequest)
                    )
            })
        })
 
        context(`DELETE /api/requests/:request_id`, () => {
            it('responds 204 and checks request has been deleted', () => {
                const idToRemove = 2
                const expectedRequests = helpers.makeExpectedRequests(testCareRequests)
                const newExpectedRequests = expectedRequests.filter(request => request.id !== idToRemove)

                return supertest(app)
                    .delete(`/api/requests/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/requests`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(newExpectedRequests)
                    )
            })
        })       
    })

    describe('No exisiting requests', () => {
        before('insert users', () => {
                helpers.seedUsers(db, testUsers)
            })

        after('cleanup',() => db.raw('TRUNCATE admin_users, care_requests RESTART IDENTITY CASCADE'))

        context('GET /api/requests', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get(`/api/requests`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            })
        })

        context('GET /api/requests/:request_id', () => {
            it(`responds with 400 and error message`, () => {
                const request_id = 12345
                return supertest(app)
                    .get(`/api/requests/${request_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, { error: { message: `Request doesn't exist` }})
            })
        })

        context('PATCH /api/requests/:request_id', () => {
            it(`responds with 400 and error message`, () => {
                const request_id = 12345
                return supertest(app)
                    .get(`/api/requests/${request_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, { error: { message: `Request doesn't exist` }})
            })
        })

        context(`DELETE /api/requests/:request_id`, () => {
            it(`responds with 400 and error message`, () => {
                const request_id = 12345
                return supertest(app)
                    .get(`/api/requests/${request_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, { error: { message: `Request doesn't exist` }})
            })
        })
    })

    
    describe(`POST /api/requests`, () => {
        context('given bad request', () => {
            it(`returns 400, and error message`, () => {
                const badRequest = testNewRequests[1]

                return supertest(app)
                    .post('/api/requests')
                    .send(badRequest)
                    .expect(400, {error: 'Bad Request'})
            })
        })

        context('given valid request', () => {
            it('creates request, returns 201 and correct request', () => {
                const newRequest = {
                    absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
                    other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'Jane Smith', email: 'jane@smith.com', phone: '301-111-5555', age_mos: 3, 
                    age_yrs: 2, breed: 'Lab', dog_name: 'Rover', exam: '2019-01', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
                    care_date: '2019-10-01', service: 'Day Care', status: 'Pending'
                }

                return supertest(app)
                    .post('/api/requests')
                    .send(newRequest)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.absent).to.eql(newRequest.absent)
                        expect(res.body.aggression).to.eql(newRequest.aggression)
                        expect(res.body.bite).to.eql(newRequest.bite)
                        expect(res.body.bite_details).to.eql(newRequest.bite_details)
                        expect(res.body.children).to.eql(newRequest.children)
                        expect(res.body.crate).to.eql(newRequest.crate)
                        expect(res.body.escape).to.eql(newRequest.escape)
                        expect(res.body.growl).to.eql(newRequest.growl)
                        expect(res.body.growl_other).to.eql(newRequest.growl_other)
                        expect(res.body.other_pets).to.eql(newRequest.other_pets)
                        expect(res.body.prior_care).to.eql(newRequest.prior_care)
                        expect(res.body.visitors).to.eql(newRequest.visitors)
                        expect(res.body.contact_name).to.eql(newRequest.contact_name)
                        expect(res.body.email).to.eql(newRequest.email)
                        expect(res.body.phone).to.eql(newRequest.phone)
                        expect(res.body.age_mos).to.eql(newRequest.age_mos)
                        expect(res.body.age_yrs).to.eql(newRequest.age_yrs)
                        expect(res.body.breed).to.eql(newRequest.breed)
                        expect(res.body.dog_name).to.eql(newRequest.dog_name)
                        expect(res.body.exam).to.eql(newRequest.exam)
                        expect(res.body.medical).to.eql(newRequest.medical)
                        expect(res.body.sex).to.eql(newRequest.sex)
                        expect(res.body.spayed).to.eql(newRequest.spayed)
                        expect(res.body.vaccines).to.eql(newRequest.vaccines)
                        expect(res.body.care_date).to.eql(newRequest.care_date)
                        expect(res.body.service).to.eql(newRequest.service)
                        expect(res.body.status).to.eql(newRequest.status)
                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
            })
        })
    })

    describe('XSS Attack', () => {
        before('insert users', () => {
            helpers.seedUsers(db, testUsers)
        })

        after('cleanup',() => db.raw('TRUNCATE admin_users, care_requests RESTART IDENTITY CASCADE'))

        context(`GET Given an XSS attack request`, () => {
            const {
                maliciousRequest,
                expectedSanitizedRequest
            } = helpers.makeMaliciousRequest()

            beforeEach('insert malicious request', () =>{
                return helpers.seedMaliciousRequest(
                    db,
                    maliciousRequest
                )
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/requests`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].absent).to.eql(expectedSanitizedRequest.absent)
                        expect(res.body[0].contact_name).to.eql(expectedSanitizedRequest.contact_name)
                    })
            })
        })
    })
})

