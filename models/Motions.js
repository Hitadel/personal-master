module.exports = (sequelize, DataTypes) => {
    const Motions = sequelize.define("Motions", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: "고유번호 UUID",
      },
      type: {
        type: DataTypes.STRING(100),
        comment: "운동 타입",
      },
      time: {
        type: DataTypes.INTEGER,
        comment: "시간",
      },
      count: {
        type: DataTypes.INTEGER,
        comment: "횟수",
      },
      score: {
        type: DataTypes.INTEGER,
        comment: "점수",
      },
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Motions", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    Motions.associate = models => {
      // Users.hasOne(models.Motions, {foreignKey: "user_id", sourceKey: 'id'}); //외래키 등록. 자식에게 줌
      Motions.belongsTo(models.Users, {foreignKey: "user_id", sourceKey: "id"}); // 외래키로 쓰는 녀석. 부모에게서 받음
  };
  
    return Motions;
  };