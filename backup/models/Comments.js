module.exports = (sequelize, DataTypes) => {

    const Comments = sequelize.define("Comments", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        Comment: "고유번호 UUID",
      },
      context: {
        type: DataTypes.TEXT,
        Comment: "내용",
      },
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Comments", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    Comments.associate = models => {
        Comments.belongsTo(models.Users, {foreignKey: "user_name", sourceKey: "name"}); // 외래키로 쓰는 녀석. 부모에게 받음
        Comments.belongsTo(models.Boards, {foreignKey: "board_id", sourceKey: "id"}); // 외래키로 쓰는 녀석. 부모에게 받음
    };
  
    return Comments;
  };