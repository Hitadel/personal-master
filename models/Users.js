module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: "고유번호 UUID",
      },
      email: {
        type: DataTypes.STRING(100),
        validate: {
          isEmail: true,
        },
        comment: "이메일",
      },
      password: {
        type: DataTypes.STRING(60),
        comment: "비밀번호",
      },
      name: {
        type: DataTypes.STRING(100),
        comment: "이름",
      },
      phone: {
        type: DataTypes.STRING(72),
        comment: "전화번호",
      },
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Users", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    Users.associate = models => {
        /**
         * Users안에 있는 "id값"을 "user_id라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다.
         */
        Users.hasOne(models.Motions, {foreignKey: "user_id", sourceKey: 'id'}); //외래키 등록. 자식에게 줌
        // example.belongsTo(models.Users, {foreignKey: "user_id", sourceKey: "id"}); // 외래키로 쓰는 녀석. 부모에게 받음
    };
  
    return Users;
  };