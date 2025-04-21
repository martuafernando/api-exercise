const { Product } = require("../models");

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class ProductController {
	static async getAllProducts(req, res, next) {
		const products = await Product.findAll();

		res.json({
			message: "success",
			data: products,
		});
	}

	static async add(req, res, next) {
		const { name, price } = req.body;

		if (!name || !price) {
			res.status(400).json({
				message: "name and price required",
			});
		}

		await Product.create({
			name,
			price,
		});

		res.status(201).json({
			message: "product added successfully",
		});
	}
}

module.exports = ProductController;
