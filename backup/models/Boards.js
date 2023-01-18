module.exports = (sequelize, DataTypes) => {

    const Boards = sequelize.define("Boards", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: "고유번호 UUID",
      },
      title: {
        type: DataTypes.STRING(100),
        comment: "제목",
      },
      context: {
        type: DataTypes.TEXT,
        comment: "내용",
      },
      hit: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
        comment: "조회수",
      },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: "0",
        comment: "좋아요",
      },
      category: {
        type: DataTypes.STRING(100),
        defaultValue: "일반",
        comment: "카테고리"
      }
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Boards", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    Boards.associate = models => {
        Boards.belongsTo(models.Users, {foreignKey: "user_name", sourceKey: "name"}); // 외래키로 쓰는 녀석. 부모에게 받음
    };
  
    return Boards;
  };