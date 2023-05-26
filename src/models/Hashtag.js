import Sequelize from "sequelize";

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtag",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsTo(db.Post, { foreignKey: "post_id", targetKey: "id" });
  }
};
