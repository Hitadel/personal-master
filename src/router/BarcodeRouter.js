import express from "express";
import { saveBarcode } from "../controller/BarcodeController";
import passport from "passport";

const BarcodeRouter = express.Router();

BarcodeRouter.post("/save", passport.authenticate('jwt', { session: false }),  saveBarcode);

export default BarcodeRouter;
