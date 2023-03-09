import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";

const PassportRouter = express.Router();


PassportRouter.post("/post", async (req, res, next) => {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        res.status(400).json({ message: info.message });
        return;
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
       res.json({ token });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

PassportRouter.post('/auth', passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
	  try {
	    res.json({ result: true });
	  } catch (error) {
	    console.error(error);
	    next(error);
	  }
});



export default PassportRouter;
