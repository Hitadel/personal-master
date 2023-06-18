import express from "express";
import morgan from "morgan";
import path from "path";
import db from "./models";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import passportConfig from "./middlewares/passport";
import { MotionRouter, BarcodeRouter, SignupRouter, BoardRouter, PassportRouter, ResetPwRouter, AuthRouter, ProfileRouter, PlannerRouter } from "./router";
import CommunityRouter from "./router/CommunityRouter";
import PostRouter from "./router/PostRouter";

const redisClient = require('./config/redisConfig');
const app = express();
const logger = morgan("dev");

// -- パスポート初期化
app.use(passport.initialize());
passportConfig(); // パスポート設定
// パスポート --

// -- redis 設定
redisClient.on('connect', function() {
  console.log('Redis client connected');
});

redisClient.on('error', function (err) {
  console.log('Redis client error:', err);
});
redisClient.connect()

// redis --

// -- sequelize 設定
db.sequelize
  .sync({ force: false }) // force: true (保存するたびにDBを初期化) / force: false (既存DBに上書き)
  .then(() => {
    console.log("DB接続完了");
  })
  .catch((err) => {
    console.error(err);
  });

// sequelize --

app.use(cookieParser());
app.use(logger);


// publicフォルダへのアクセス権限付与
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: false }));

// CORS 設定
app.use(
  cors({
    origin: [process.env.NODE_ENV === "development" ? process.env.DEV_CLIENT_DOMAIN : process.env.MY_DOMAIN, "http://localhost/"],
    credentials: true,
  })
);

// ルーティング
app.use("/motion", MotionRouter);
app.use("/signup", SignupRouter);
app.use("/barcode", BarcodeRouter);
app.use("/login", PassportRouter);
app.use("/board", BoardRouter);
app.use("/auth", AuthRouter);
app.use("/found_password", ResetPwRouter);
app.use("/profile", ProfileRouter);
app.use("/planner", PlannerRouter);
app.use("/community", CommunityRouter);
app.use("/post", PostRouter);

export default app;
