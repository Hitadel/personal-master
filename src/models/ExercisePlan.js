import Sequelize from "sequelize";

module.exports = class ExercisePlan extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 固有キー、INT、自動増加
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdAt: {
          // INT
          type: Sequelize.DATE, // dateTimeタイプ
          allowNull: false,
        },
        type: {
          // STRING(100文字まで)、Null不可
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        count: {
          // INT、デフォルト値:0
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        set: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        check: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "ExercisePlan",
        tableName: "exercisePlan",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }

  static associate(db) {
    db.ExercisePlan.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
};
