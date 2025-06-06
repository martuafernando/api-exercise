require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		dialect: process.env.DATABASE_DIALECT,
	},
	test: {
		username: process.env.DATABASE_TEST_USERNAME,
		password: process.env.DATABASE_TEST_PASSWORD,
		database: process.env.DATABASE_TEST_NAME,
		host: process.env.DATABASE_TEST_HOST,
		dialect: process.env.DATABASE_TEST_DIALECT,
	},
}
	