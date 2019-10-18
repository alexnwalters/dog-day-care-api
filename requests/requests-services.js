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
    }
}

module.exports = RequestsService