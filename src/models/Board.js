import Sequelize from "sequelize";

module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          // STRING (100자까지), Null 허용 X
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        context: {
          // TEXT, Null 허용 X
          type: Sequelize.TEXT,
          allowNull: false,
        },
        hit: {
          // INT, 기본 값 : 0
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        category: {
          // STRING (100자까지), 기본 값 : "일반"
          type: Sequelize.STRING(100),
          defaultValue: "일반",
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Board",
        tableName: "board",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Board.belongsTo(db.User, { foreignKey: "user_name", sourceKey: "name" });
    db.Board.belongsTo(db.User, { foreignKey: "user_id", sourceKey: "id" });
    db.Board.hasOne(db.Comment, { foreignKey: "board_id", sourceKey: "id" });
  }
};
