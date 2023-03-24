import Status from "../models/Status";
import User from "../models/User";


const indexProfile = async(req, res, next) => {
  try {
    const profile = await User.findOne({
      where: {id: req.user.id}
    })
    return res.status(200).json(profile);
  } catch(err){
    console.error(err)
    return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
  }
}

export {indexProfile}