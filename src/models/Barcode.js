import Sequelize from "sequelize";

module.exports = class Barcode extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          // 고유키, INT, 자동 증가
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        DESC_KOR: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        ANIMAL_PLANT: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT1: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        }, 
        SERVING_WT: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        }, 
        NUTR_CONT2: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT3: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT4: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT5: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT6: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT7: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT8: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        NUTR_CONT9: {
          // STRING (100자까지), Null 허용
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Barcode",
        tableName: "barcode",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_unicode_ci",
      }
    );
  }
  static associate(db) {
    db.Barcode.belongsTo(db.User, { foreignKey: "user_id", sourceKey: "id" });
  }
};
