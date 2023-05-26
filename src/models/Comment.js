import Sequelize from "sequelize";

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          // TEXT, Null 허용 X
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
