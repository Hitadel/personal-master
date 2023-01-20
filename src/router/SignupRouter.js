import express from "express";
import { signupCheck, signupPost } from "../controller/signupController";

const SignupRouter = express.Router();

SignupRouter.post("/post", signupPost);
SignupRouter.post(`api/signup/emailCheck?useremail=${useremail}`, signupCheck);
// 주소, 컨트롤러 (함수) 설정

export default SignupRouter;
