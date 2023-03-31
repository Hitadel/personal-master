import Status from "../models/Status";
import User from "../models/User";
import Nutrition from "../models/Nutrition";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisConfig";
import {createHashedPassword} from "../utils/crypto"
const sequelize = require("sequelize");
const { Op } = require("sequelize");


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

const nutritionCalculator = async(date, req, period) => {
  let condition = 24 * 60 * 60 * 1000; // 하루 뒤 만들기 위한 조건 (24시간)
  const trueDate = new Date(Date.parse(date) + condition); // 하루 뒤
  condition *= period; // 기간 조건
  const condition1 = new Date(trueDate.getTime() - condition); // 시작
  const condition2 = trueDate; // 끝
  console.log(condition1, "컨디션1", condition2, "컨디션2")
  return await Nutrition.findAll({
    where: {
      user_id: req.user.id,
      createdAt: { [Op.between]: [condition1, condition2] }} //시작과 끝
    })
}


const nutritionProfile = async (req, res, next) => {
  try{
    const {period, date} = req.body
    // console.log(date, "받아온 거", trueDate, "하루 뒤", period);
    // const trueDate = new Date(Date.parse(date));
    let period2, result;
    if (period === "day") period2 = 1
    if (period === "week") period2 = 7
    if (period === "month") period2 = 31
    let nutrition = await nutritionCalculator(date, req, period2);
    if (period === "day"){
      result = {
        '15:00-21:00': 0,
        '21:00-03:00': 0,
        '03:00-09:00': 0,
        '09:00-15:00': 0,
      };
      nutrition.forEach((nutrition) => {
        const time = new Date(nutrition.createdAt).getHours(); // 발생 시간 (시간 단위)
        if (time >= 15 && time < 21) { // 15시~21시 구간 00:00 ~ 06:00
          result['야식'] += nutrition.calorie;
        } else if (time >= 21 || time < 3) { // 21시~3시 구간 06:00 ~ 12:00
          result['아침'] += nutrition.calorie;
        } else if (time >= 3 && time < 9) { // 3시~9시 구간 12:00 ~ 18:00
          result['점심'] += nutrition.calorie;
        } else if (time >= 9 && time < 15) { // 9시~15시 구간 18:00 ~ 24:00
          result['저녁'] += nutrition.calorie;
        }
      });
    }

    console.log(nutrition, "결과1");
    console.log(result, "결과");
  return res.status(200).json({nutrition});
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

export {indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile, nutritionProfile}