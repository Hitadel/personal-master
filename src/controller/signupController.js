import User from "../models/User";
import crypto from "crypto";

export const signupCheck = async (req,res,next) => {
  try{
    const {useremail} = req.body;
    let flag = false;
    let result = await User.findAll({
        where: {
            email: useremail
        }
    })
    if (result.length !== 0) {
      flag = false;
    } else {
      flag = true;
    }
    res.json({
      login: flag, email
    })
    return res.status(200).json("SUCCESS");
  }catch(err){
    console.error(err);
  }
}

export const signupPost = async (req, res, next) => {
  try {
    const {useremail, name, phoneNumber} = req.body;
    const password = await createHashedPassword(req.body.password);

    // 암호화 전 비밀번호를 받아 암호화 처리
    const createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt(); // salt 만들어서 대입
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ password: key.toString('base64'), salt });
        });
    });
    // => 최종적으로 암호화된 비밀번호, salt 반환
    // salt 반환 이유 : 각 유저의 비밀번호 암호화되는데 사용된 salt다르기 때문에, 유저마다 소유해야 비교 가능
    
    // 레인보우 테이블 방지를 위한 salt
    const createSalt = () =>
      new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
    
    await User.create({
      email: useremail, 
      name, 
      phoneNumber, 
      password,
      salt,
    });
    // 성공 시 클라이언트로 "SUCCESS" 메시지 응답
    return res.status(200).json("SUCCESS");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
