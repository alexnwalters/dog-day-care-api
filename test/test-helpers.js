const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
            admin_users,
            care_requests
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE admin_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE care_requests_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('admin_users_id_seq', 0)`),
                trx.raw(`SELECT setval('care_requests_id_seq', 0)`),
            ])
        )
    )
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            full_name: 'Test user 1',
            password: 'Password1',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            user_name: 'test-user-2',
            full_name: 'Test user 2',
            password: 'Password2',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
    ]
}

function makeCareRequestsArray() {
    return [
        {
            id: 1, absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
            other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'Jane Smith', email: 'jane@smith.com', phone: '301-111-5555', age_mos: 3, 
            age_yrs: 2, breed: 'Lab', dog_name: 'Rover', exam: '2019-01', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
            care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2, absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
            other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'John Smith', email: 'jane@smith.com', phone: '301-222-5555', age_mos: 3, 
            age_yrs: 2, breed: 'Lab', dog_name: 'Spot', exam: '2019-02', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
            care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3, absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
            other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'Jane Doe', email: 'jane@smith.com', phone: '301-333-5555', age_mos: 3, 
            age_yrs: 2, breed: 'Lab', dog_name: 'Lassie', exam: '2019-03', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
            care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 4, absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
            other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'John Doe', email: 'jane@smith.com', phone: '301-444-5555', age_mos: 3, 
            age_yrs: 2, breed: 'Lab', dog_name: 'Brian',exam: '2019-04',medical: 'nothing to note',sex: 'Male',spayed: 'Yes', vaccines: 'Yes',
            care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
        },
    ]
}

function makeNewRequestsArray() {
    return [
        {
            absent: 'ok', aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
            other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', contact_name: 'Jane Smith', email: 'jane@smith.com', phone: '301-111-5555', age_mos: 3, 
            age_yrs: 2, breed: 'Lab', dog_name: 'Rover', exam: '2019-01', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
            care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            dog_name: 'Bad Dog'
        },
    ]
}

function makeRequestFixtures() {
    const testUsers = makeUsersArray()
    const testCareRequests = makeCareRequestsArray()
    const testNewRequests = makeNewRequestsArray()
    return { testUsers, testCareRequests, testNewRequests }
}

function makeExpectedRequests(requests) {
    return requests.map(request => {
        return {
            id: request.id,
            behavioral_info: {
                absent: request.absent,
                aggression: request.aggression,
                bite: request.bite,
                bite_details: request.bite_details,
                children: request.children,
                crate: request.crate,
                escape: request.escape,
                growl: request.growl,
                growl_other: request.growl_other,
                other_pets: request.other_pets,
                prior_care: request.prior_care,
                visitors: request.visitors,
            },
            contact_info: {
                contact_name: request.contact_name,
                email: request.email,
                phone: request.phone,
            },
            dog_info: {
                age_mos: request.age_mos,
                age_yrs: request.age_yrs,
                breed: request.breed,
                dog_name: request.dog_name,
                exam: request.exam,
                medical: request.medical,
                sex: request.sex,
                spayed: request.spayed,
                vaccines: request.vaccines
            },
            service_info: {
                care_date: request.care_date,
                service: request.service,
                status: request.status,
            },
            date_created: request.date_created
        }
    })
}

function makeMaliciousRequest() {
    const maliciousRequest = {
        id: 911,
        absent: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`, 
        contact_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        aggression: 'No', bite: 'No', bite_details: 'n/a', children: 'ok', crate: 'Yes', escape: 'No', growl: 'No', growl_other: 'No', 
        other_pets: 'Yes', prior_care: 'Yes', visitors: 'ok', email: 'jane@smith.com', phone: '301-111-5555', age_mos: 3, 
        age_yrs: 2, breed: 'Lab', dog_name: 'Rover', exam: '2019-01', medical: 'nothing to note', sex: 'Male', spayed: 'Yes', vaccines: 'Yes',
        care_date: '2019-10-01', service: 'Day Care', status: 'Pending', date_created: '2029-01-22T16:28:32.615Z'
    }

    const expectedSanitizedRequest = {
        id: maliciousRequest.id,
        behavioral_info: {
            absent: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
            aggression: maliciousRequest.aggression,
            bite: maliciousRequest.bite,
            bite_details: maliciousRequest.bite_details,
            children: maliciousRequest.children,
            crate: maliciousRequest.crate,
            escape: maliciousRequest.escape,
            growl: maliciousRequest.growl,
            growl_other: maliciousRequest.growl_other,
            other_pets: maliciousRequest.other_pets,
            prior_care: maliciousRequest.prior_care,
            visitors: maliciousRequest.visitors,
        },
        contact_info: {
            contact_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
            email: maliciousRequest.email,
            phone: maliciousRequest.phone,
        },
        dog_info: {
            age_mos: maliciousRequest.age_mos,
            age_yrs: maliciousRequest.age_yrs,
            breed: maliciousRequest.breed,
            dog_name: maliciousRequest.dog_name,
            exam: maliciousRequest.exam,
            medical: maliciousRequest.medical,
            sex: maliciousRequest.sex,
            spayed: maliciousRequest.spayed,
            vaccines: maliciousRequest.vaccines
        },
        service_info: {
            care_date: maliciousRequest.care_date,
            service: maliciousRequest.service,
            status: maliciousRequest.status,
        },
        date_created: maliciousRequest.date_created
    }

    return {
        maliciousRequest,
        expectedSanitizedRequest,
    }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('admin_users').insert(preppedUsers)
        .then(() => 
            db.raw(
                `SELECT setval('admin_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedTables(db, users, requests) {
    return db.transaction( async trx => {
        await seedUsers(trx, users)
        await trx.into('care_requests').insert(requests)
        await trx.raw(
           `SELECT setval('care_requests_id_seq', ?)`,
           [requests[requests.length - 1].id]
       )
    })
}

function seedMaliciousRequest(db, request) {
    return db.transaction(async trx => {
        await trx.into('care_requests').insert(request)
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}` 
}

module.exports = {
    cleanTables,
    makeUsersArray,
    makeCareRequestsArray,
    makeNewRequestsArray,
    makeRequestFixtures,
    makeMaliciousRequest,
    seedUsers,
    seedTables,
    makeExpectedRequests,
    seedMaliciousRequest,
    makeAuthHeader,
}