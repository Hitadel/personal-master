import express from "express";
import { createBoard, updateBoard, deleteBoard, showBoard, indexBoard } from "../controller/BoardController";

const BoardRouter = express.Router();

BoardRouter.get("/index", indexBoard);
BoardRouter.get("/show", showBoard);
BoardRouter.post("/create", createBoard);
BoardRouter.post("/update", updateBoard);
BoardRouter.post("/delete", deleteBoard);

export default BoardRouter;