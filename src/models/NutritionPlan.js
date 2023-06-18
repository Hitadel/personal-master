import Sequelize from "sequelize";

module.exports = class NutritionPlan extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 固有鍵、INT、自動増加
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        name: {
          // STRING (100文字まで)、Null不可
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        calorie: {
          // INT、デフォルト値 : 0
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        protein: {
          // INT、デフォルト値 : 0
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },  
        fat: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        cho: {
          type: Sequelize.DOUBLE,
          allowNull: false,
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