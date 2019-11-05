# Dog Day Care API

An Express Server use to run the dog day care app. Used to authenticate admin users, and services the CRUD operations. 

Live Demo: [Dog Day Care - Pawsitive Vibez](https://dog-day-care-app.now.sh/)

## Setup

Download and start the client-side application found at [Dog-Day-Care-App](https://github.com/alexnwalters/Dog-Day-Care-App).

At minimum create an .env file with a JWT_SECRET variable and assign variables for your database to meet the requirements for the postgrator-config.js file in order to migrate you database.

## Endpoints

### '/requests'

#### GET
Returns all care requests. Requires 'authorization' header.

#### POST
Submits new care requests.

### '/requests/:request_id'

#### GET 
Gets single request by id. Requires 'authorization' header.

#### PATCH
Updates request by id. Requires 'authorization' header.

#### DELETE
Deletes request by id. Requires 'authorization' header.

### '/auth/login'
#### POST
Verifies admin users, returns authorization token to be used in header for protected endpoints.

## Skills

* Node.js / Express
* PostgreSQL
* Knex
* JWT / Bcrypt

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

Be sure to create .env variables for your production database to meet the requirements of the postgrator-production-config.js file.

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

