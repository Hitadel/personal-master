import express from "express";
import { emailSend, signupCheck, signupPost } from "../controller/signupController";

const SignupRouter = express.Router();

SignupRouter.post("/post", signupPost);
SignupRouter.get('/emailCheck/:email', signupCheck);
SignupRouter.post('/evf/:id', emailSend);
// 주소, 컨트롤러 (함수) 설정

export default SignupRouter;
