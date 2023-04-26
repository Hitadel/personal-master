import User from "../models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {createHashedPassword} from "../utils/crypto"

export const emailSend = async (req, res, next) => {
  const useremail = req.body.id;
  const sendEvfcode = crypto.randomBytes(3).toString("hex");

  const smtpServerURL = "smtp.gmail.com";
  const authUser = process.env.NODEMAILER_USER;
  const authPass = process.env.NODEMAILER_PASS;
  const fromEmail = "younggo1701077@gmail.com";
  let toEmail = useremail;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  function sendEmail(toEmail, title, txt) {
    let transporter = nodemailer.createTransport({
      host: smtpServerURL, //SMTP 서버 주소
      secure: true, //보안 서버 사용 false로 적용시 port 옵션 추가 필요
      auth: {
        user: authUser, //메일서버 계정
        pass: authPass, //메일서버 비번
      },
    });

    let mailOptions = {
      from: fromEmail, //보내는 사람 주소
      to: toEmail, //받는 사람 주소
      subject: title, //제목
      text: txt, //본문
    };

    //전송 시작!
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        //에러
        console.log(error);
      }
      //전송 완료
      console.log("Finish sending email : ");
      transporter.close();
    });
  }
  sendEmail(toEmail, "The Weighter에서 보낸 인증메일입니다.", `인증 번호: ${sendEvfcode}`);
  return res.json({ data: sendEvfcode });
};

// 이메일 전송
export const signupCheck = async (req, res, next) => {
  try {
    const { email } = req.body;

    let result = await User.findAll({
      where: {
        email,
      },
    });

    if (result.length === 0) {
      return res.status(200).json({result: true});
    } else {
      return res.status(200).json({result: false});
    }
  } catch (err) {
    console.error(err);
  }
};

// 계정 생성
export const signupPost = async (req, res, next) => {
  try {
    let { email, name, phone, gender} = req.body;

    const pwdObj = await createHashedPassword(req.body.password);
    const salt = pwdObj.createdSalt;
    const password = pwdObj.password;

    // => 최종적으로 암호화된 비밀번호, salt 반환
    // salt 반환 이유 : 각 유저의 비밀번호 암호화되는데 사용된 salt다르기 때문에, 유저마다 소유해야 비교 가능

    // 레인보우 테이블 방지를 위한 salt
    if (gender == "male")
    gender = true;
    else 
    gender = false;
    const user = await User.create({
      email,
      name,
      phone,
      password,
      salt,
      gender
    });
    const updatedName = `${name}#${user.id}`;
    await user.update({ name: updatedName });
    return res.status(200).json({result: true});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
};