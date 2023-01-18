import express from "express";
import morgan from "morgan";
import path from "path";
import db from "./models";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MotionRouter } from "./router";

const app = express();
const logger = morgan("dev");

db.sequelize
  .sync({ force: false }) // force: true (저장할 때마다 DB 초기화) / force: false (기존 DB에 덮어쓰기)
  .then(() => {
    console.log("DB연결 완료");
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
    origin: [process.env.NODE_ENV === "development" ? process.env.DEV_CLIENT_DOMAIN : process.env.PRODUCT_CLIENT_DOMAIN, "http://localhost:3001"],
    credentials: true,
  })
);

app.use("/motion", MotionRouter); // MotionRouter 주소 부여, 연결

export default app;
