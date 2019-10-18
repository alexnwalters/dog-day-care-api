BEGIN;

TRUNCATE
    admin_users,
    care_requests
    RESTART IDENTITY CASCADE;

INSERT INTO admin_users (user_name, full_name, password)
VALUES
    ('TestUser', 'Tester', 'Test123'),
    ('AdminUser', 'Administrator', 'Admin123');

INSERT INTO care_requests (contact_name, email, phone, dog_name, breed, age_yrs, age_mos,
                sex, spayed, exam, vaccines, medical, prior_care, crate, escape, other_pets,
                aggression, growl, growl_other, bite, bite_details, children, visitors, absent, 
                care_date, service, status)
VALUES
    ('Jane Smith', 'jane@smith.com', '301-555-5555', 'Rover', 'Lab', 3, 2, 'Male', 'Yes', '2019-06', 'Yes', 'nothing to note', 
    'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'No', 'n/a', 'playful', 'avoids', 'ok', '2019-10-01', 'Day Care', 'Pending'),
    ('Lucy Duval', 'lucy@duval.com', '301-666-5555', 'Cujo', 'St. Bernard', 6, 6, 'Male', 'Yes', '2016-06', 'Yes', 'nothing to note', 
    'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'Yes', 'they deserved it', 'barks a lot', 'jumps on', 'chases mailman', '2019-10-01', 'Overnight Care', 'Declined'),
    ('Carol Carter', 'carol@carter.com', '301-777-5555', 'Spot', 'Pug', 1, 9, 'Female', 'Yes', '2019-08', 'Yes', 'was rescue needs vitamins', 
    'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'No', 'n/a', 'friendly', 'comfortable around people he knows, avoids strangers', 'very anxious', '2019-10-01', 'Day Care', 'Accepted'),
    ('David Davis', 'dave@davis.com', '301-888-5555', 'Lassie', 'Collie', 8, 1, 'Female', 'Yes', '2019-03', 'Yes', 'nothing to note', 
    'Yes', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'No', 'n/a', 'ok', 'ok', 'ok', '2019-10-01', 'Overnight Care', 'Pending');

COMMIT;