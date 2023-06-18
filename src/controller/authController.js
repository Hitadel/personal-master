const redisClient = require("../config/redisConfig");


export const logout = async (req,res,next) => {
  try{
    const token = req.headers.authorization.split(' ')[1]; // JWTトークンは一般的に「Bearer[トークン値]」形式で配信されるため、必要な[トークン値]のみを切るコ
    redisClient.set(token, 'Unauthorized', 'EX', 3600); // トークンの有効期限 (一時間)
    return res.status(200).json({result: true});;
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "サーバーエラーが発生しました。"});
  }
}