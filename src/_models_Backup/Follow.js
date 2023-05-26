import Sequelize from "sequelize";

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Follow",
        tableName: "follow",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Follow.belongsTo(db.User, { foreignKey: "follower_id", targetKey: "sns_id" });
    db.Follow.belongsTo(db.User, { foreignKey: "following_id", targetKey: "sns_id" });
  }
};
