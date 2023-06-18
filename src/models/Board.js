import Sequelize from "sequelize";

module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 固有キー、INT、自動増加
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          // STRING(100文字まで)、Null不可
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        content: {
          // TEXT、Null不可
          type: Sequelize.TEXT,
          allowNull: false,
        },
        hit: {
          // INT、デフォルト値:0
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        like: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        category: {
          // STRING(100文字まで)、デフォルト値:"一般"
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
    db.Board.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    db.Board.hasMany(db.Comment, { foreignKey: "board_id", sourceKey: "id"});
    db.Board.belongsTo(db.User, { foreignKey: "user_name", targetKey: "name" });
  }
};
