import Sequelize from "sequelize";

module.exports = class Motion extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          foreignKey: true,
        },
        type: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        timer: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        count: {
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
        timestamps: true,
        underscored: false,
        modelName: "Motion",
        tableName: "motion",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Motion.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
};
