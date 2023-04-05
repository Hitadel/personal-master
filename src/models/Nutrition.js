import Sequelize from "sequelize";

module.exports = class Nutrition extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        manufacturer: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        size: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        calorie: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        cho: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        protein: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        fat: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        sugars: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        salt: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        chole: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        satur_fat: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
        trans_fat: {
          type: Sequelize.DOUBLE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamp: true,
        underscored: false,
        modelName: "Nutrition",
        tableName: "Nutrition",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Nutrition.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
};
