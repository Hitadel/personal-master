import express from "express";
import passport from "passport";
import { createComments, createPost, deleteComment, deletePost, getComments, getDetail, getPost } from "../controller/PostController";

const PostRouter = express.Router();

PostRouter.post("/", passport.authenticate("jwt", { session: false }), createPost);
PostRouter.get("/", passport.authenticate("jwt", { session: false }), getPost);
PostRouter.get("/detail", getDetail);
PostRouter.get("/comment", getComments);
PostRouter.post("/comment", passport.authenticate("jwt", { session: false }), createComments);
PostRouter.post("/delete", passport.authenticate("jwt", { session: false }), deletePost);
PostRouter.post("/comment/delete", passport.authenticate("jwt", { session: false }), deleteComment);

export default PostRouter;
