import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
const redisClient = require('../config/redisConfig');

const PassportRouter = express.Router();


PassportRouter.post("/post", async (req, res, next) => {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        return res.status(400).json({ message: info.message });;
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
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
});


export default PassportRouter;
