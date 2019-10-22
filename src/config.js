module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/dog_day_care',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/dog_day_care_test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CLIENT_ORIGIN: 'https://dog-day-care-app.now.sh/',
}