import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
const redisClient = require('../config/redisConfig');

const PassportRouter = express.Router();


PassportRouter.post("/post", async (req, res, next) => {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      // console.log(user)
      if (passportError || !user) {
        res.status(400).json({ message: info.message });
        return;
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) 
          return res.send(loginError);;
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
       res.json({ data: token, message: "로그인 완료"});
      });
    })(req, res, next);
  } catch (error) {
    console.error(error);
  }
});


export default PassportRouter;
