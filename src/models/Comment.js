import Sequelize from "sequelize";

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 固有キー、INT、自動増加
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          // TEXT、Null不可
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Comment",
        tableName: "comment",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: "user_id", targetKey: "sns_id" });
    db.Comment.belongsTo(db.Post, { foreignKey: "post_id", targetKey: "id", onDelete: "CASCADE" });
  }
};
