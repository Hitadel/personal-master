import express from "express";
import morgan from "morgan";
import path from "path";
import db from "./models";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MotionRouter, BarcodeRouter, SignupRouter, BoardRouter, PassportRouter, ResetPwRouter, AuthRouter, ProfileRouter } from "./router";
import passport from "passport";
import passportConfig from "./middlewares/passport";
const redis = require("redis");
const redisClient = require("./config/redisConfig");
const app = express();
const logger = morgan("dev");

//패스포트
app.use(passport.initialize()); //passport 구동
passportConfig();
//패스포트

//redis
redisClient.on("connect", function () {
  console.log("Redis client connected");
});

redisClient.on("error", function (err) {
  console.log("Redis client error:", err);
});
redisClient.connect().then();

//redis

db.sequelize
  .sync({ force: false }) // force: true (저장할 때마다 DB 초기화) / force: false (기존 DB에 덮어쓰기)
  .then(() => {
    console.log("DB 연결 완료");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cookieParser());
app.use(logger);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: false }));

app.use(
  cors({
    origin: [process.env.NODE_ENV === "development" ? process.env.DEV_CLIENT_DOMAIN : process.env.PRODUCT_CLIENT_DOMAIN, "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/motion", MotionRouter); // MotionRouter 주소 부여, 연결
app.use("/signup", SignupRouter);
app.use("/barcode", BarcodeRouter);
app.use("/login", PassportRouter);
app.use("/board", BoardRouter);
app.use("/auth", AuthRouter);
app.use("/found_password", ResetPwRouter);
app.use("/profile", ProfileRouter);

export default app;
