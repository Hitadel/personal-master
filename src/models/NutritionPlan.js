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
        food: {
          // STRING (100자까지), Null 허용 X
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        kcal: {
          // INT, 기본 값 : 0
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        protein: { // 단백질
          // INT, 기본 값 : 0
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },  
        fat: { // 지방
          // INT
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        carb: { // 탄수화물
          // INT
          type: Sequelize.INTEGER,
          allowNull: false,
        },          
      },
      {
        sequelize,
        timestamps: true,
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