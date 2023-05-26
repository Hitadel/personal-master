import { Sequelize } from "sequelize";
import cfg from "../config/config";
import fs from "fs";

const env = process.env.NODE_ENV || "development";
const config = cfg[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const result = fs.readdirSync("./src/models").filter((el) => el != "index.js"); // src/models의 모든 파일명을 result 배열에 저장 (index.js 제외)

const key = result
  .filter((el) => el != "index.js")
  .map((el) => {
    return el
      .split("_")
      .map((el) => el[0].toUpperCase() + el.slice(1)) // 맨 처음글자를 대문자로
      .join("")
      .replace(".js", ""); // .js 삭제
  });

result.forEach((value, idx) => {
  const model = require("./" + value);
  db[key[idx]] = model;
});

result.forEach((v) => {
  const model = require("./" + v);
  model.init(sequelize);
});

result.forEach((v) => {
  const model = require("./" + v);
  model.associate(db);
});

export default db;
