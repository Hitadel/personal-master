import express from "express";
import { saveMotion } from "../controller/MotionController";
import passport from "passport";

const MotionRouter = express.Router();

MotionRouter.post("/save", passport.authenticate('jwt', { session: false }),  saveMotion);
// 주소, 컨트롤러 (함수) 설정

export default MotionRouter;
