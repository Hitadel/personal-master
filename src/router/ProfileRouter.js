import express from "express";
import { indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile, nutritionProfile } from "../controller/profileController";
import passport from "passport";

const ProfileRouter = express.Router();

ProfileRouter.post("/", passport.authenticate('jwt', { session: false }),  indexProfile);
ProfileRouter.post("/personalModify", passport.authenticate('jwt', { session: false }),  personalModifyProfile);
ProfileRouter.post("/currentPassword", passport.authenticate('jwt', { session: false }),  passwordConfirmProfile);
ProfileRouter.post("/passwordModify", passport.authenticate('jwt', { session: false }),  passwordModifyProfile);
ProfileRouter.post("/statusModify", passport.authenticate('jwt', { session: false }),  statusModifyProfile);
ProfileRouter.post("/nutrition", passport.authenticate('jwt', { session: false }),  nutritionProfile);

export default ProfileRouter;
