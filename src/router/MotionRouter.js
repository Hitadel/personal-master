import express from "express";
import { saveMotion } from "../controller/MotionController";
import passport from "passport";

const MotionRouter = express.Router();

MotionRouter.post("/save", passport.authenticate('jwt', { session: false }),  saveMotion);

export default MotionRouter;
