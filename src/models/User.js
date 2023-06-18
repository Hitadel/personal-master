import Sequelize from "sequelize";

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 固有鍵、INT、自動増加
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          // STRING (100文字まで)、Email形式、Null不可
          type: Sequelize.STRING(100),
          validate: {
            isEmail: true,
          },
          allowNull: false,
        },
        password: {
          // STRING (100文字まで)、Null不可
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        name: {
          // STRING (100文字まで)、Null不可
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        gender: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        phone: {
          // STRING (72文字まで)、Null不可
          type: Sequelize.STRING(72),
          allowNull: false,
        },
        salt: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        sns_id: {
          type: Sequelize.STRING(100),
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "user",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Motion, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.Nutrition, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.Comment, { foreignKey: "user_id", sourceKey: "sns_id" });
    db.User.hasMany(db.Post, { foreignKey: "user_id", sourceKey: "sns_id" });
    db.User.hasMany(db.Follow, { foreignKey: "follower_id", sourceKey: "sns_id" });
    db.User.hasMany(db.Follow, { foreignKey: "following_id", sourceKey: "sns_id" });
    db.User.hasMany(db.Images, { foreignKey: "user_id", sourceKey: "sns_id" });
  }
};
