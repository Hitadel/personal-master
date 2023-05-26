import express from "express";
import passport from "passport";
import { createProfile, follow, getOtherProfile, getProfile, getSearch } from "../controller/CommunityController";

const CommunityRouter = express.Router();

CommunityRouter.get("/", passport.authenticate("jwt", { session: false }), getProfile);
CommunityRouter.post("/others", getOtherProfile);
CommunityRouter.post("/follow", passport.authenticate("jwt", { session: false }), follow);
CommunityRouter.post("/create", passport.authenticate("jwt", { session: false }), createProfile);
CommunityRouter.post("/search", getSearch);

export default CommunityRouter;
