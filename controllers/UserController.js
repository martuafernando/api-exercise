const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class UserController {
	static async register(req, res, next) {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password || !role) {
			throw {
				statusCode: 400,
				message: "Name, email, password, and role required",
			};
		}

		const isUserRegistered = User.findOne({
			where: {
				email
			}
		})

		if (isUserRegistered?.id) {
			throw {
				statusCode: 400,
				message: "email has been registered",
			};
		}

		const salt = await bcrypt.genSalt(10);
		const passwordHashed = await bcrypt.hash(password, salt);

		await User.create({
			name,
			email,
			password: passwordHashed,
			role,
		});

		res.status(201).json({
			message: "account created successfully",
		});
	}

	static async login(req, res, next) {
		const { email, password } = req.body;

		if (!email || !email) {
			throw {
				statusCode: 400,
				message: "email and password required",
			};
		}

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw {
				statusCode: 400,
				message: "incorrect email or password",
			};
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw {
				statusCode: 400,
				message: "incorrect email or password",
			};
		}

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role,
			},
			process.env.JWT_KEY,
			{ expiresIn: "1h" },
		);

		res.json({
			message: "success",
			data: {
				token
			},
		});
	}

	static async getAll(req, res, next) {
		const data = await User.findAll();

		res.json({
			message: "Success",
			data,
		});
	}
}

module.exports = UserController;
