const { Purchase, Product } = require("../models");

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class PurchaseController {
	static async purchaseProduct(req, res, next) {
		const { productId } = req.body;

		if (!productId) {
			throw {
				statusCode: 400,
				message: "productId required",
			};
		}

		const product = await Product.findByPk(productId);

		if (!product?.id) {
			throw {
				statusCode: 404,
				message: "productId not found",
			};
		}

		await Purchase.create({
			productId,
			userId: req.user.id,
		});

		res.json({
			message: "Purchasing successful",
		});
	}
}

module.exports = PurchaseController;
