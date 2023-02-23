import express from "express";
import { createBoard, updateBoard, deleteBoard, showBoard, indexBoard, createComment, updateComment, deleteComment } from "../controller/BoardController";

const BoardRouter = express.Router();

BoardRouter.get("/index", indexBoard);
BoardRouter.get("/show", showBoard);
BoardRouter.post("/create", createBoard);
BoardRouter.post("/comment/create", createComment);
BoardRouter.post("/comment/update", updateComment);
BoardRouter.post("/comment/delete", deleteComment);
BoardRouter.post("/update", updateBoard);
BoardRouter.post("/delete", deleteBoard);

export default BoardRouter;