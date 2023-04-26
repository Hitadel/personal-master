const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisConfig');
import {createHashedPassword} from "../utils/crypto"

module.exports = () => {
  // passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
  //   done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  // });

  // passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  //   done(null, user); // 여기의 user가 req.user가 됨
  // });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pw',
    session: false, // 세션에 저장 여부
    passReqToCallback: false,
  }, async (id, password, done) => {
    // console.log(id, password);
    const result = await Users.findOne({where:{email: id}})
      if (result == null)
        return done(null, false, { message: '존재하지 않는 아이디입니다.' }); // 임의 에러 처리
      else {
      const pwdObj = await createHashedPassword(password, result.salt);
      const hash = pwdObj.password;
        if (result.password == hash){
            return done(null, result); // 검증 성공
          }
          else
          return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
      }
    }));

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    passReqToCallback: true
  };
  passport.use(new JwtStrategy(jwtOptions, async (req, jwt_payload, done) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const reply = await redisClient.get(token);
      if (reply)
        return done(401, false, {message: '로그아웃됐습니다.'});
      else
        return done(null, jwt_payload.user, {message: "Authorized"});
      } catch (err) {
    return done(err, false);
  }
  }))
}