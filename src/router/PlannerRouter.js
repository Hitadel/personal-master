import passport from "passport";
const express = require("express");
const plannerController = require("../controller/plannerController");

const PlannerRouter = express.Router();

PlannerRouter.post("/exercise", passport.authenticate("jwt", { session: false }), plannerController.createExercisePlan);
PlannerRouter.post("/nutrition", passport.authenticate("jwt", { session: false }), plannerController.createNutritionPlan);
PlannerRouter.post("/planCheck", passport.authenticate("jwt", { session: false }), plannerController.planCheck);

export default PlannerRouter;
