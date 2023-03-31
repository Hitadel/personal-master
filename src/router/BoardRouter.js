import express from "express";
import { createBoard, updateBoard, deleteBoard, showBoard, indexBoard, createComment, updateComment, deleteComment, likeBoard } from "../controller/BoardController";
import passport from "passport";

const BoardRouter = express.Router();

BoardRouter.get("/index/:page/:limit", indexBoard);
BoardRouter.get("/show/:id", showBoard);
BoardRouter.post("/create", passport.authenticate('jwt', { session: false }), createBoard);
// BoardRouter.post("/like", likeBoard);
BoardRouter.post("/comment/create", passport.authenticate('jwt', { session: false }), createComment);
BoardRouter.post("/comment/update", passport.authenticate('jwt', { session: false }), updateComment);
BoardRouter.post("/comment/delete", passport.authenticate('jwt', { session: false }), deleteComment);
BoardRouter.post("/update", passport.authenticate('jwt', { session: false }), updateBoard);
BoardRouter.post("/delete", passport.authenticate('jwt', { session: false }), deleteBoard);

export default BoardRouter;