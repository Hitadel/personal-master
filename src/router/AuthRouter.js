import express from "express";
import { logout } from "../controller/AuthController";
import passport from "passport";

const AuthRouter = express.Router();

AuthRouter.post("/logout", passport.authenticate("jwt", { session: false }), logout);

export default AuthRouter;
