import Sequelize from "sequelize";

module.exports = class Status extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        age: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        height: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        weight: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        disease: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "정보 없음",　//情報なし
        },
        allergy: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "정보 없음",　//情報なし
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Status",
        tableName: "status",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Status.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
};
