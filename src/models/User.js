import Sequelize from "sequelize";

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          // STRING (100자 까지), Email 형식, Null 허용 X
          type: Sequelize.STRING(100),
          validate: {
            isEmail: true,
          },
          allowNull: false,
        },
        password: {
          // STRING (60자까지), Null 허용 X
          type: Sequelize.STRING(60),
          allowNull: false,
        },
        name: {
          // STRING (100자까지), Null 허용 X
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        phone: {
          // STRING (72자까지), Null 허용 X
          type: Sequelize.STRING(72),
          allowNull: false,
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
    db.User.hasOne(db.Motion, { foreignKey: "user_id", sourceKey: "id" });
  }
};
