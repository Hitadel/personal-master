import Sequelize from "sequelize";

module.exports = class Images extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Images",
        tableName: "images",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }

  static associate(db) {
    db.Images.belongsTo(db.User, { foreignKey: "user_id", targetKey: "sns_id" });
    db.Images.belongsTo(db.Post, { foreignKey: "post_id", targetKey: "id" });
  }
};
