import express from "express";
import { emailSend, signupCheck, signupPost } from "../controller/SignupController";

const SignupRouter = express.Router();

SignupRouter.post("/post", signupPost);
SignupRouter.post('/emailCheck', signupCheck);
SignupRouter.post('/evf', emailSend);

export default SignupRouter;