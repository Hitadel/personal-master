const redisClient = require("../config/redisConfig");


export const logout = async (req,res,next) => {
  const token = req.headers.authorization.split(' ')[1];
  redisClient.set(token, 'Unauthorized', 'EX', 3600);
  return res.status(200).json({message: "SUCCESS"});;
}