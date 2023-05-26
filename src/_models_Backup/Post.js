import Sequelize from "sequelize";

module.exports = class Post extends Sequelize.Model {
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
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "post",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: "user_id", targetKey: "sns_id" });
    db.Post.hasMany(db.Hashtag, { foreignKey: "post_id", sourceKey: "id" });
    db.Post.hasMany(db.Comment, { foreignKey: "post_id", sourceKey: "id" });
    db.Post.hasMany(db.Images, { foreignKey: "post_id", sourceKey: "id" });
  }
};
