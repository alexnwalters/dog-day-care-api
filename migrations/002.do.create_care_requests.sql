CREATE TYPE status_options AS ENUM(
    'Pending',
    'Accepted',
    'Declined'
);

CREATE TYPE care_options AS ENUM (
    'Day Care',
    'Overnight Care'
);

CREATE TYPE sex_options AS ENUM (
    'Male',
    'Female'
);

CREATE TYPE yes_no_options AS ENUM (
    'Yes',
    'No'
);

CREATE TABLE care_requests (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    dog_name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age_yrs INT NOT NULL,
    age_mos INT NOT NULL,
    sex sex_options NOT NULL,
    spayed yes_no_options NOT NULL,
    exam TEXT NOT NULL,
    vaccines yes_no_options NOT NULL,
    medical TEXT,
    prior_care yes_no_options NOT NULL,
    crate yes_no_options NOT NULL,
    escape yes_no_options NOT NULL,
    other_pets yes_no_options NOT NULL,
    aggression yes_no_options NOT NULL,
    growl yes_no_options NOT NULL,
    growl_other yes_no_options NOT NULL,
    bite yes_no_options NOT NULL,
    bite_details TEXT NOT NULL,
    children TEXT NOT NULL,
    visitors TEXT NOT NULL,
    absent TEXT NOT NULL,
    care_date TEXT NOT NULL,
    service care_options NOT NULL,
    status status_options NOT NULL,
    date_created TIMESTAMP default NOW() NOT NULL
);