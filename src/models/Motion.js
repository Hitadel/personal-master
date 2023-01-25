import Sequelize from "sequelize";

module.exports = class Motion extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          // STRING (100자까지), Null 허용 X
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        time: {
          // INT, Null 허용 X
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        count: {
          // INT, Null 허용 X
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        score: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Motion",
        tableName: "motion",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Motion.belongsTo(db.User, { foreignKey: "user_id", sourceKey: "id" });
  }
};
