import Sequelize from "sequelize";

module.exports = class Barcode extends Sequelize.Model {
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
        carb: {
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
        timestampa: true,
        underscored: false,
        modelName: "Barcode",
        tableName: "barcode",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Barcode.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
};
