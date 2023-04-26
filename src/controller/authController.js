const redisClient = require("../config/redisConfig");


export const logout = async (req,res,next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    redisClient.set(token, 'Unauthorized', 'EX', 3600);
    return res.status(200).json({result: true});;
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}