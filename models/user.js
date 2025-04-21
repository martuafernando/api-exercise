"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			User.belongsToMany(models.Product, {
				through: models.Purchase,
				foreignKey: "userId",
				otherKey: "productId",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	}
	User.init(
		{
			name: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Please enter a valid email"
					},
				}
			},
			password: DataTypes.STRING,
			role: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
		},
	);
	return User;
};
