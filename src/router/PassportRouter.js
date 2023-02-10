import passport from "passport";
import express from "express";

const PassportRouter = express.Router();

PassportRouter.post("/post", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/');
  });

export default PassportRouter;
