import express from "express";
import { signupPost } from "../controller/signupController";

const SignupRouter = express.Router();

SignupRouter.post("/post", signupPost);
// 주소, 컨트롤러 (함수) 설정

export default SignupRouter;
