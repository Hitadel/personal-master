import Sequelize from "sequelize";

module.exports = class NutritionPlan extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        name: {
          // STRING (100자까지), Null 허용 X
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        calorie: {
          // INT, 기본 값 : 0
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        protein: { // 단백질
          // INT, 기본 값 : 0
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },  
        fat: { // 지방
          // INT
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        cho: { // 탄수화물
          // INT
          type: Sequelize.DOUBLE,
          allowNull: false,
        },          
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "NutritionalPlan",
        tableName: "nutritionalPlan",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }

  static associate(db) {
    db.NutritionPlan .belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
  }
}