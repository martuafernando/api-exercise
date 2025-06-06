"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Product.belongsToMany(models.User, {
				through: models.Purchase,
				foreignKey: "productId",
				otherKey: "userId",
        onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	}
	Product.init(
		{
			name: DataTypes.STRING,
			price: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Product",
		},
	);
	return Product;
};
