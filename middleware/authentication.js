const jwt = require("jsonwebtoken");
const { User } = require('../models')

async function authentication(req, res, next) {
	const token = req.headers.authorization?.split(" ")?.[1];

	if (!token) {
		throw {
			statusCode: 401,
			message: "Token required",
		};
	}

	const payload = jwt.verify(token, process.env.JWT_KEY);

	if (!payload?.id) {
		throw {
			statusCode: 401,
			message: "Token invalid",
		};
  }

  const user = await User.findByPk(payload.id)

  if (!user) {
		throw {
			statusCode: 401,
			message: "Token invalid",
		};
  }

	req.user = user

  next()
}

module.exports = authentication;
