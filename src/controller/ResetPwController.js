import User from "../models/User";
import {createHashedPassword} from "../utils/crypto"

export const resetPassword = async (req, res, next) => {
  try {
    // レインボーテーブル防止のためのSalt

      const pwdObj = await createHashedPassword(req.body.password);
      const password = pwdObj.password

    await User.update({
      password,
      salt: pwdObj.createdSalt,
    },{where:{email: req.body.email}});

    return res.status(200).json({result:true});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: "サーバーエラーが発生しました。"});
  }
};