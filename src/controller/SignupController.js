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

  function sendEmail(toEmail, title, txt) {
    let transporter = nodemailer.createTransport({
      host: smtpServerURL, // SMTPサーバーアドレス

      secure: true, // セキュリティサーバーの使用をfalseに適用する場合、portオプションの追加が必要
      auth: {
        user: authUser, // メールサーバーアカウント
        pass: authPass, // メールサーバーパスワード
      },
    });

    let mailOptions = {
      from: fromEmail, // 送信アドレス
      to: toEmail, // 発信アドレス
      subject: title, // タイトル
      text: txt, // 本文
    };

    // 転送始め
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      // 転送完了
      console.log("Finish sending email : ");
      transporter.close();
    });
  }
  sendEmail(toEmail, "The Weighterからの認証メールです。", `認証番号: ${sendEvfcode}`);
  return res.json({ data: sendEvfcode });
};

// 電子メール転送
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

// アカウント作成
export const signupPost = async (req, res, next) => {
  try {
    let { email, name, phone, gender} = req.body;

    const pwdObj = await createHashedPassword(req.body.password);
    const salt = pwdObj.createdSalt;
    const password = pwdObj.password;

    // => 最終的に暗号化されたパスワードとSaltを保存
    // salt保存理由:各ユーザのパスワード暗号化に使用されたSaltが異なるため、ユーザごとに所有していないと比較できない

    // レインボーテーブル防止のためのSalt
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
    return res.status(500).json({message: "サーバーエラーが発生しました。"});
  }
};