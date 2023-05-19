import express from "express";
import { resetPassword } from "../controller/ResetPwController";
import passport from "passport";

const ResetPwRouter = express.Router();

ResetPwRouter.post('/post', resetPassword);
// 주소, 컨트롤러 (함수) 설정

export default ResetPwRouter;