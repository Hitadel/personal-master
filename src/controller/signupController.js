import User from "../models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const emailSend = async (req,res,next) => {
  const useremail = req.params.id;
  const sendEvfcode = crypto.randomBytes(3).toString('hex');
  console.log(useremail);
  console.log(sendEvfcode);

  const smtpServerURL = "smtp.gmail`.com"
  const authUser = process.env.NODEMAILER_USER
  const authPass = process.env.NODEMAILER_PASS
  const fromEmail = 'younggo1701077@gmail.com'
  let toEmail = useremail;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  function sendEmail(toEmail, title, txt) {
      let transporter = nodemailer.createTransport({
          host: smtpServerURL,    //SMTP 서버 주소
          secure: true,           //보안 서버 사용 false로 적용시 port 옵션 추가 필요
          auth: {
              user: authUser,     //메일서버 계정
              pass: authPass      //메일서버 비번
          }
      });

      let mailOptions = {
          from: fromEmail,        //보내는 사람 주소
          to: toEmail ,           //받는 사람 주소
          subject: title,         //제목
          text: txt               //본문
      };

      //전송 시작!
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              //에러
              console.log(error);
          }
          //전송 완료
          console.log("Finish sending email : ");
          transporter.close()
      })
  }
  res.json({sendEvfcode: sendEvfcode});
  sendEmail(toEmail, "The Weighter에서 보낸 인증메일입니다.", `인증 번호: ${sendEvfcode}`)
}


export const signupCheck = async (req,res,next) => {
  try{
    console.log("test");
    const {email} = req.params;
    let flag = false;
    let result = await User.findAll({
        where: {
            email
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
