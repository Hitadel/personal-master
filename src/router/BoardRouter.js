import express from "express";
import { createBoard, updateBoard, deleteBoard, showBoard, indexBoard, createComment, updateComment, deleteComment } from "../controller/BoardController";

const BoardRouter = express.Router();

BoardRouter.get("/index/:page/:limit", indexBoard);
BoardRouter.get("/show/:id/:page/:limit/:asc", showBoard);
BoardRouter.post("/create", createBoard);
BoardRouter.post("/comment/:board_id/create", createComment);
BoardRouter.post("/comment/:board_id/update", updateComment);
BoardRouter.post("/comment/:board_id/delete", deleteComment);
BoardRouter.post("/update", updateBoard);
BoardRouter.post("/delete", deleteBoard);

export default BoardRouter;