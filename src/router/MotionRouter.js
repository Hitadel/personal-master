import express from "express";
import { saveMotion } from "../controller/motionController";

const MotionRouter = express.Router();

MotionRouter.post("/save", saveMotion);
// 주소, 컨트롤러 (함수) 설정

export default MotionRouter;
