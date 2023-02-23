const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/User');
import crypto from "crypto";


module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pw',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
  }, async (id, password, done) => {
    console.log(id, password);
    const result = await Users.findOne({where:{email: id}})
      if (result == null)
        return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
      else {
        const createHashedPassword = (password) =>
        new Promise(async (resolve, reject) => {
          crypto.pbkdf2(password, result.dataValues.salt, 9999, 64, "sha512", (err, key) => {
            if (err) reject(err);
            resolve({password: key.toString("base64")});
          });
        });
      const pwdObj = await createHashedPassword(password);
      const hash = pwdObj.password;
        if (result.dataValues.password == hash){
            return done(null, result); // 검증 성공
          }
          else
          return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
      }
    }));
  };