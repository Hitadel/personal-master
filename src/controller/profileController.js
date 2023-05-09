import Status from "../models/Status";
import Motion from "../models/Motion";
import User from "../models/User";
import Nutrition from "../models/Nutrition";
import ExercisePlan from "../models/ExercisePlan";
import NutritionPlan from "../models/NutritionPlan";
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

const modelPeriodCalculator = async(date, req, period, model, modelCondition) => {
  let condition = 24 * 60 * 60 * 1000; // 하루 뒤 만들기 위한 조건 (24시간)
  const startDate = new Date(Date.parse(date) + condition); // 하루 뒤
  condition *= period; // 기간 조건
  const condition1 = new Date(startDate.getTime() - condition); // 시작
  const condition2 = startDate; // 끝
  const whereClause = {
    user_id: req.user.id,
    createdAt: { [Op.between]: [condition1, condition2] }
  };
  if (modelCondition) {
    whereClause.type = modelCondition;
  }
  return await model.findAll({
    where: whereClause
  });
}

const addModelToResult = (input, framework, timeIndex) => {
  Object.keys(input[timeIndex]).forEach(key => {
    if (Object.keys(framework).includes(key)) {
      if (key == "createdAt" || key == "type")
      input[timeIndex][key] = framework[key];
      else
      input[timeIndex][key] += framework[key];
    }
  });
  return input[timeIndex];
}

const forEachFunction = (model, input, period, date) => {
  let startDate, endDate, time, timeIndex
  let condition = 24 * 60 * 60 * 1000; // 하루 뒤 만들기 위한 조건 (24시간)
  if (period == "week"){
    startDate = new Date(Date.parse(date) + condition) // 하루 뒤
    endDate = new Date(startDate - 7 * 24 * 60 * 60 * 1000).getDate(); 
  }
  console.log(startDate, "언제란겨");
  model.forEach((instances) => {
    console.log(instances.createdAt, "띠용");
    let framework = {}
    if (period === "day")
    time = new Date(instances.createdAt).getHours(); // 발생 일자
    else if (period === "week")
    time = new Date(instances.createdAt).getDate(); // 발생 일자
    else if (period === "month")
    time = new Date(instances.createdAt).getDate(); // 발생 일자
    else
    time = new Date(instances.createdAt).getMonth() + 1; // 발생 일자
    for (const key in instances.dataValues)
      if (key !== 'createdAt' || 'type')
      framework[key] = instances.dataValues[key];
    if (period === "day"){
    if (time >= 0 && time < 5) //야식 또는 새벽
    input[3] = addModelToResult(input, framework, 3);
    else if (time >= 5 && time < 11) //아침
      input[0] = addModelToResult(input, framework, 0);
    else if (time >= 11 && time < 17) //점심
      input[1] = addModelToResult(input, framework, 1);
    else if (time >= 17 && time <= 23) //저녁
      input[2] = addModelToResult(input, framework, 2);
      return input;
    } else {
      if (period === "week"){
      let minus = new Date(date).getDate() - 6;
      timeIndex = time - minus;
      if (timeIndex > 6 || timeIndex < 0){
        minus = endDate
        timeIndex = time - minus;
      }
    }
      else if (period === "month"){
        if (time <= 0 || time > 31) return; // 잘못된 날짜는 무시합니다.
      timeIndex = time - 1; // 일자에 맞는 인덱스를 계산합니다.
    }
    else{
    if (time <= 0 || time > 12) return;
    timeIndex = time - 1;
    }
      return input[timeIndex] = addModelToResult(input, framework, timeIndex);
}});
}


const nutritionProfile = async (req, res, next) => {
  try{
    const {period, date, newData} = req.body
    let period2, result;
    if (period === "day") period2 = 1
    if (period === "week") period2 = 7
    if (period === "month") period2 = 31
    if (period === "year") period2 = 365
    let nutrition = await modelPeriodCalculator(date, req, period2, Nutrition);
    if (period === "day"){
      result = Array.from({ length: 4 }, (_, i) => ({ time: ["아침", "점심", "저녁", "야식"][i], calorie: 0, cho: 0, protein: 0, fat: 0, createdAt: 0, createdAt: 0 }));
      forEachFunction(nutrition, result, period)
    }
    if (period === "week"){
      result = Array.from({ length: 7 }, (_, i) => ({ time: `${i+1}일`, calorie: 0, cho: 0, protein: 0, fat: 0, createdAt: 0 }));
      forEachFunction(nutrition, result, period, date)
    }

    if (period === "month"){
      result = Array.from({ length: 31 }, (_, i) => ({ time: `${i+1}일`, calorie: 0, cho: 0, protein: 0, fat: 0, createdAt: 0 }));
      forEachFunction(nutrition, result, period)
    }

    if (period === "year"){
      result = Array.from({ length: 12 }, (_, i) => ({ time: `${i+1}월`, calorie: 0, cho: 0, protein: 0, fat: 0, createdAt: 0 }));
      forEachFunction(nutrition, result, period)
    }

  return res.status(200).json(result);
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

const exerciseProfile = async (req, res, next) => {
  try{
    const {period, date, condition} = req.body
    console.log(date,"봅니다")
    let period2, result;
    if (period === "day") period2 = 1
    if (period === "week") period2 = 7
    if (period === "month") period2 = 31
    if (period === "year") period2 = 365
    let motion = await modelPeriodCalculator(date, req, period2, Motion, condition);
    if (period === "day"){
      result = Array.from({ length: 4 }, (_, i) => ({ time: ["아침", "점심", "저녁", "새벽"][i], type: 0, count: 0, score: 0, timer: 0, createdAt: 0}));
      forEachFunction(motion, result, period)
    }
    if (period === "week"){
      result = Array.from({ length: 7 }, (_, i) => ({ time: `${i+1}일`, type: 0, count: 0, score: 0, timer: 0, createdAt: 0}));
      forEachFunction(motion, result, period, date)
    }

    if (period === "month"){
      result = Array.from({ length: 31 }, (_, i) => ({ time: `${i+1}일`, type: 0, count: 0, score: 0, timer: 0, createdAt: 0}));
      forEachFunction(motion, result, period)
    }

    if (period === "year"){
      result = Array.from({ length: 12 }, (_, i) => ({ time: `${i+1}월`, type: 0, count: 0, score: 0, timer: 0, createdAt: 0}));
      forEachFunction(motion, result, period)
    }

  return res.status(200).json(result);
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

const aiPlan = async (req, res, next) => {
  try{
    const {category} = req.body
    let result
    if (category == "exercise")
    result = await ExercisePlan.findAll({
      where: {user_id: req.user.id}
    })
    else if (category == "nutrition")
    result = await NutritionPlan.findAll({
      where: {user_id: req.user.id}
    })
    console.log(result)
  return res.status(200).json({result});
  }catch(err){
    console.error(err)
    return res.status(500).json({message: "서버 에러가 발생하였습니다."});
  }
}

export {indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile, nutritionProfile, exerciseProfile, aiPlan}