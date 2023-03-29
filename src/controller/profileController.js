import Status from "../models/Status";
import User from "../models/User";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisConfig";
import {createHashedPassword} from "../utils/crypto"


const indexProfile = async(req, res, next) => {
  try {
    const profile = await User.findOne({
      where: {id: req.user.id}
    })
    const status = await Status.findOne({
      where: {id: req.user.id}
    })
    return res.status(200).json({profile, status});
  } catch(err){
    console.error(err)
    return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
  }
}

const personalModifyProfile = async(req, res, next) => {
  try {
    let {name, gender, email} = req.body
    if (gender == "male")
    gender = true;
    else 
    gender = false;
    name = `${name}#${req.user.id}`;
    const profile = await User.update({
      name,
      email,
      gender
    },
    {
      where: {id: req.user.id}
    })
    const user = await User.findOne({
      where: {id: req.user.id}
    })
    const currentToken = req.headers.authorization.split(' ')[1];
    redisClient.set(currentToken, 'Unauthorized', 'EX', 3600);
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({data: token});
  } catch(err){
    console.error(err)
    return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
  }
}

const passwordConfirmProfile = async (req, res, next) => {
  try{
    const {password} = req.body
    const user = await User.findOne({
      where: {id: req.user.id}
    })
    const pwdObj = await createHashedPassword(password, user.salt);
      const hash = pwdObj.password;
        if (user.password == hash){
          return res.status(200).json({result: true})
        }
        else
        return res.status(401).json({message: "비밀번호가 다릅니다."})
  } catch(err) {
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

const passwordModifyProfile = async (req, res, next) => {
  try{
    const pwdObj = await createHashedPassword(req.body.password);
    const password = pwdObj.password

  await User.update({
    password,
    salt: pwdObj.createdSalt,
  },{where:{id: req.user.id}});

  return res.status(200).json({result:true});
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

const statusModifyProfile = async (req, res, next) => {
  try{
    const {age, height, weight, disease, allergy} = req.body
    console.log(req.body);
  const status = await Status.update({
    age,
    height,
    weight,
    disease,
    allergy
  },{where:{id: req.user.id}});
  if (!status[0]){
    await Status.create({
      user_id: req.user.id,
      age,
      height,
      weight,
      disease,
      allergy
    });
  }
  return res.status(200).json({result:true});
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

export {indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile}