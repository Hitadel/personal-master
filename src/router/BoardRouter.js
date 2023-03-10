import express from "express";
import { createBoard, updateBoard, deleteBoard, showBoard, indexBoard, createComment, updateComment, deleteComment, likeBoard } from "../controller/BoardController";

const BoardRouter = express.Router();

BoardRouter.get("/index/:page/:limit", indexBoard);
BoardRouter.get("/show/:id", showBoard);
BoardRouter.post("/create", createBoard);
BoardRouter.post("/like", likeBoard);
BoardRouter.post("/comment/create", createComment);
BoardRouter.post("/comment/update", updateComment);
BoardRouter.post("/comment/delete", deleteComment);
BoardRouter.post("/update", updateBoard);
BoardRouter.post("/delete", deleteBoard);

export default BoardRouter;