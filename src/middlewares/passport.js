const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisConfig');
import {createHashedPassword} from "../utils/crypto"

module.exports = () => {

  passport.use(new LocalStrategy({ // ローカル戦略
    usernameField: 'id',
    passwordField: 'pw',
    session: false, // セッション保存の有無
    passReqToCallback: false,
  }, async (id, password, done) => {
    const result = await Users.findOne({where:{email: id}})
      if (result == null)
        return done(null, false, { message: '存在しないIDです。' }); // フロントで使うものに備えたメッセージ
      else {
      const pwdObj = await createHashedPassword(password, result.salt);
      const hash = pwdObj.password;
        if (result.password == hash){
            return done(null, result); // 検証成功
          }
          else
          return done(null, false, { message: 'パスワードが間違っています。' }); // フロントで使うものに備えたメッセージ
      }
    }));

  // JWTオプションオブジェクトを定義します。
  // JWTトークンを抽出するために認証ヘッダーのベアラ(Bearer)トークンを使用し、 (Bearerは、HTTP要求で使用されるtoken認証方式)
  // 秘密鍵として環境変数から取得したJWT秘密鍵を使用してリクエストオブジェクトをコールバック関数に渡すことができるように設定しました。
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    passReqToCallback: true
  };
  // リクエストヘッダからJWTトークンを抽出し、Redisを使ってトークンのログアウトの有無を確認した後、
  // 認証結果とそのユーザー情報をコールバック関数に渡します。
  passport.use(new JwtStrategy(jwtOptions, async (req, jwt_payload, done) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // JWTトークンは一般的に「Bearer[トークン値]」形式で配信されるため、必要な[トークン値]のみを切るコード
      const reply = await redisClient.get(token);
      if (reply)
        return done(401, false, {message: 'ログアウトしました。'});
      else
        return done(null, jwt_payload.user, {message: "Authorized"});
      } catch (err) {
    return done(err, false);
  }
  }))
}