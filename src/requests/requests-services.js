const xss = require('xss')

const RequestsService = {
    getCareRequests(db){
        return db
            .from('care_requests')
            .select(
                'id',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    absent,
                                    aggression,
                                    bite,
                                    bite_details,
                                    children,
                                    crate,
                                    escape,
                                    growl,
                                    growl_other,
                                    other_pets,
                                    prior_care,
                                    visitors
                            ) tmp)
                        )
                    ) AS "behavioral_info"`
                ),
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    contact_name,
                                    phone,
                                    email
                            ) tmp)
                        )
                    ) AS "contact_info"`
                ),
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    age_mos,
                                    age_yrs,
                                    breed,
                                    dog_name,
                                    exam,
                                    medical,
                                    sex,
                                    spayed,
                                    vaccines
                            ) tmp)
                        )
                    ) AS "dog_info"`
                ),
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    care_date,
                                    service,
                                    status
                            ) tmp)
                        )
                    ) AS "service_info"`
                ),
                'date_created'
            )
    },

    getCareRequestById(knex, id) {
        return knex('care_requests')
            .where('id', id)
            .first()
    },

    updateRequest(knex, id, updateStatus) {
        return knex('care_requests')
            .where({ id })
            .update(updateStatus)
    },

    insertNewRequest(db, NewRequest) {
        return db
            .insert(NewRequest)
            .into('care_requests')
            .returning('*')
            .then(([request]) => request)
    },

    deleteRequest(knex, id) {
        return knex('care_requests')
            .where({ id })
            .delete()
    },

    serializeRequest(request) {
        const { behavioral_info, contact_info, dog_info } = request
        return {
            ...request,
            behavioral_info: {
                ...behavioral_info,
                absent: xss(behavioral_info.absent),
                children: xss(behavioral_info.children),
                visitors: xss(behavioral_info.visitors),
            },
            contact_info: {
                ...contact_info,
                contact_name: xss(contact_info.contact_name),
            },
            dog_info: {
                ...dog_info,
                breed: xss(dog_info.breed),
                dog_name: xss(dog_info.dog_name),
                medical: xss(dog_info.medical),
            }
        }
    },
}

module.exports = RequestsService