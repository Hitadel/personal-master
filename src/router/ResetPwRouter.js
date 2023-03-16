import express from "express";
import { resetPassword } from "../controller/resetPwController";

const ResetPwRouter = express.Router();

ResetPwRouter.post('/post', resetPassword);
// 주소, 컨트롤러 (함수) 설정

export default ResetPwRouter;