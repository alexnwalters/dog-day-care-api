const app = require('../src/app')
const knex = require('knex')
const { expect } = require('chai')
const helpers = require('./test-helpers')

describe.only('Requests Endpoints', function() {
    let db

    const {
        testUsers,
        testCareRequests
    } = helpers.makeRequestFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    before('clean the tables', () => helpers.cleanTables(db))

    after('disconnet from db', () => db.destroy())

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/requests', () => {
        context('given no requests exists', () => {
            //will beforeEach() add users once auth

            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get(`/api/requests`)
                    .expect(200, [])
            })
        })

        context('given there are existing requests', () => {
            beforeEach('insert requests', () => 
                helpers.seedTables(
                    db,
                    testCareRequests
                )
            )

            it('responds with 200 and all of the requests', () => {
                const expectedReviews = helpers.makeExpectedRequests(testCareRequests)

                return supertest(app)
                    .get(`/api/requests`)
                    .expect(200, expectedReviews)
            })
        })
    })
})

