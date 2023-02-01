import express from "express";
import { saveBarcode } from "../controller/BarcodeController";

const BarcodeRouter = express.Router();

BarcodeRouter.post("/save", saveBarcode);

export default BarcodeRouter;
