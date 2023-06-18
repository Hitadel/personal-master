import { Sequelize } from "sequelize";
import cfg from "../config/config";
import fs from "fs";

const env = process.env.NODE_ENV || "development";
const config = cfg[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const result = fs.readdirSync("./src/models").filter((el) => el != "index.js"); // src/modelsのすべてのファイル名をresult配列に保存(index.jsを除く)


// Sequelizeを活用してデータベースモデルを自動的にロードして初期化し、モデル間の関係設定を処理する機能を実現
const key = result
  .filter((el) => el != "index.js") // index.jsを除いて他のjsファイル名をkeyに収める 
  .map((el) => {
    return el
      .split("_")
      .map((el) => el[0].toUpperCase() + el.slice(1)) // 最初の文字を大文字で
      .join("")
      .replace(".js", ""); // .js削除
  });

// keyに入れたファイル名をモデルとして読み込む
result.forEach((value, idx) => {
  const model = require("./" + value);
  db[key[idx]] = model;
});

// モデルを初期化
result.forEach((v) => {
  const model = require("./" + v);
  model.init(sequelize);
});

// モデル関係の自動設定
result.forEach((v) => {
  const model = require("./" + v);
  model.associate(db);
});

export default db;
