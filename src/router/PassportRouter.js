import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";

const PassportRouter = express.Router();


// 次のコードはPassportミドルウェアを使ってローカル認証を行い、
// 認証が成功するとトークンを生成してログインが完了したというメッセージと共にクライアントに応答するエンドポイントです。
PassportRouter.post("/post", async (req, res, next) => {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        return res.status(400).json({ message: info.message });
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) 
          return res.send(loginError);
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
       res.json({ data: token, message: "ログイン完了"});
      });
    })(req, res, next);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "サーバーエラーが発生しました。"});
  }
});


export default PassportRouter;
