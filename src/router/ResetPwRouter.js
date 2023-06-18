import express from "express";
import { resetPassword } from "../controller/ResetPwController";
import passport from "passport";

const ResetPwRouter = express.Router();

ResetPwRouter.post('/post', resetPassword);

export default ResetPwRouter;