"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Purchase extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Purchase.belongsTo(models.Product, {
				foreignKey: "productId",
			});

      Purchase.belongsTo(models.User, {
				foreignKey: "userId",
			});
		}
	}
	Purchase.init(
		{
			userId: DataTypes.INTEGER,
			productId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Purchase",
		},
	);
	return Purchase;
};
