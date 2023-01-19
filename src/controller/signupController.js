import User from "../models/User";

export const signupPost = async (req, res, next) => {
  try {
    const {useremail, name, phoneNumber, password} = req.body;
    await User.create({
      useremail, 
      name, 
      phoneNumber, 
      password
    });
    // 성공 시 클라이언트로 "SUCCESS" 메시지 응답
    return res.status(200).json("SUCCESS");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
