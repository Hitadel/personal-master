import Status from "../models/Status";
import Motion from "../models/Motion";
import User from "../models/User";
import Nutrition from "../models/Nutrition";
import ExercisePlan from "../models/ExercisePlan";
import NutritionPlan from "../models/NutritionPlan";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisConfig";
import { createHashedPassword } from "../utils/crypto";
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const indexProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({
      where: { id: req.user.id },
    });
    const status = await Status.findOne({
      where: { user_id: req.user.id },
    });
    return res.status(200).json({ profile, status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const personalModifyProfile = async (req, res, next) => {
  try {
    let { name, gender, email } = req.body;
    if (gender == "male") gender = true;
    else gender = false;
    name = `${name}#${req.user.id}`;
    const profile = await User.update(
      {
        name,
        email,
        gender,
      },
      {
        where: { id: req.user.id },
      }
    );
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const currentToken = req.headers.authorization.split(" ")[1];
    redisClient.set(currentToken, "Unauthorized", "EX", 3600);
    const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ data: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const passwordConfirmProfile = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const pwdObj = await createHashedPassword(password, user.salt);
    const hash = pwdObj.password;
    if (user.password == hash) {
      return res.status(200).json({ result: true });
    } else return res.status(401).json({ message: "비밀번호가 다릅니다." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const passwordModifyProfile = async (req, res, next) => {
  try {
    const pwdObj = await createHashedPassword(req.body.password);
    const password = pwdObj.password;

    await User.update(
      {
        password,
        salt: pwdObj.createdSalt,
      },
      { where: { id: req.user.id } }
    );

    return res.status(200).json({ result: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const statusModifyProfile = async (req, res, next) => {
  try {
    const { age, height, weight, disease, allergy } = req.body;
    console.log(req.body);
    const status = await Status.update(
      {
        age,
        height,
        weight,
        disease,
        allergy,
      },
      { where: { user_id: req.user.id } }
    );
    if (!status[0]) {
      await Status.create({
        user_id: req.user.id,
        age,
        height,
        weight,
        disease,
        allergy,
      });
    }
    return res.status(200).json({ result: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const modelPeriodCalculator = async (date, req, period, model, modelCondition, type) => {
  let condition = 24 * 60 * 60 * 1000; // 하루 뒤 만들기 위한 조건 (24시간)
  const startDate = new Date(Date.parse(date) + condition - 1); // 23:59:59
  condition *= period; // 기간 조건
  const condition1 = new Date(startDate.getTime() - condition); // 시작
  const condition2 = startDate; // 끝
  const whereClause = {
    user_id: req.user.id,
    createdAt: { [Op.between]: [condition1, condition2] },
  };
  if (modelCondition == "exercise" || modelCondition == "exercisePlan") {
    whereClause.type = type;
  }
  const result = await model.findAll({
    where: whereClause,
  });
  return result;
};

const addModelToResult = (input, framework, timeIndex) => {
  Object.keys(input[timeIndex]).forEach((key) => {
    if (Object.keys(framework).includes(key)) {
      if (key == "createdAt" || key == "type") input[timeIndex][key] = framework[key];
      else input[timeIndex][key] += framework[key];
    }
  });
  return input[timeIndex];
};

const forEachFunction = (model, input, period, date) => {
  let startDate, endDate, time, timeIndex;
  let condition = 24 * 60 * 60 * 1000; // 하루 뒤 만들기 위한 조건 (24시간)
  if (period == "week") {
    startDate = new Date(Date.parse(date)); // 지정 당일
    endDate = new Date(startDate.getTime() - 6 * 24 * 60 * 60 * 1000).getDate();
  }
  model.forEach((instances) => {
    let framework = {};
    if (period === "day") time = new Date(instances.createdAt).getHours(); // 발생 일자
    else if (period === "week") time = new Date(instances.createdAt).getDate(); // 발생 일자
    else if (period === "month") time = new Date(instances.createdAt).getDate(); // 발생 일자
    else time = new Date(instances.createdAt).getMonth() + 1; // 발생 일자
    for (const key in instances.dataValues) if (key !== "createdAt" || "type") framework[key] = instances.dataValues[key];
    if (period === "day") {
      if (time >= 0 && time < 5)
        //야식 또는 새벽
        input[3] = addModelToResult(input, framework, 3);
      else if (time >= 5 && time < 11)
        //아침
        input[0] = addModelToResult(input, framework, 0);
      else if (time >= 11 && time < 17)
        //점심
        input[1] = addModelToResult(input, framework, 1);
      else if (time >= 17 && time <= 23)
        //저녁
        input[2] = addModelToResult(input, framework, 2);
      return input;
    } else {
      if (period === "week") {
        let currentDay = instances.createdAt.getDate();
        if (endDate > currentDay) {
          let modifiedEndDate = new Date(instances.createdAt.getFullYear(), instances.createdAt.getMonth(), 0).getDate() - endDate;
          timeIndex = currentDay + modifiedEndDate;
        } else timeIndex = currentDay - endDate;
      } else if (period === "month") {
        if (time <= 0 || time > 31) return; // 잘못된 날짜는 무시합니다.
        timeIndex = time - 1; // 일자에 맞는 인덱스를 계산합니다.
      } else {
        if (time <= 0 || time > 12) return;
        timeIndex = time - 1;
      }
      return (input[timeIndex] = addModelToResult(input, framework, timeIndex));
    }
  });
};

const profileChart = async (req, res, next) => {
  try {
    const { period, date, category, type } = req.body;
    let period2, result;

    if (period === "day") period2 = 1;
    if (period === "week") period2 = 7;
    if (period === "month") period2 = 31;
    if (period === "year") period2 = 365;

    let data, schema;
    if (category == "nutrition" || category == "nutritionPlan") {
      if (category == "nutrition") data = Nutrition;
      else if (category == "nutritionPlan") data = NutritionPlan;
      schema = {
        time: ["아침", "점심", "저녁", "야식"],
        fields: ["calorie", "cho", "protein", "fat"],
        createdAt: 0,
      };
    } else if (category == "exercise" || category == "exercisePlan") {
      if (category == "exercise") data = Motion;
      else if (category == "exercisePlan" || category == "exercisePlanList") data = ExercisePlan;
      schema = {
        time: ["아침", "점심", "저녁", "새벽"],
        fields: ["type", "count", "score", "timer"],
        createdAt: 0,
      };
    }

    let resultLength;
    switch (period) {
      case "day":
        resultLength = 4;
        break;
      case "week":
        resultLength = 7;
        break;
      case "month":
        resultLength = 31;
        break;
      case "year":
        resultLength = 12;
        break;
      default:
        throw new Error("Invalid period value");
    }

    result = Array.from({ length: resultLength }, (_, i) => ({
      time: period === "day" ? schema.time[i] : `${i + 1}${period === "week" || period == "month" ? "일" : "월"}`,
      ...schema.fields.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {}),
      ...(schema.createdAt !== undefined && { createdAt: 0 }),
    }));

    let profileData = await modelPeriodCalculator(date, req, period2, data, category, type);
    forEachFunction(profileData, result, period, date);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const aiPlan = async (req, res, next) => {
  try {
    let { period, date, category, type } = req.body;
    let result, data, nutrition, exercise;
    if (category == "nutritionPlan") data = NutritionPlan;
    if (category == "exercisePlan") data = ExercisePlan;
    let period2;
    if (period === "day") period2 = 1;
    if (period === "week") period2 = 7;
    if (period === "month") period2 = 31;
    if (period === "year") period2 = 365;
    if (category != "both"){
      category = undefined;
      result = await modelPeriodCalculator(date, req, period2, data, category, type);
      return res.status(200).json(result);
    }
    else {
      category = undefined;
      nutrition = await modelPeriodCalculator(date, req, period2, NutritionPlan)
      exercise = await modelPeriodCalculator(date, req, period2, ExercisePlan)
      return res.status(200).json({nutrition, exercise})
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const checkPost = async (req, res, next) => {
  try {
    const { items, unCheckedItems, model } = req.body;
    console.log("디버그", items);
        console.log("디버그2", unCheckedItems);
    let data;
    if (model == "NutritionPlan") data = NutritionPlan;
    if (model == "ExercisePlan") data = ExercisePlan;
    for (const item of items) {
      await data.update(
        {
          check: true,
        },
        {
          where: { id: item.id, user_id: req.user.id },
        }
      );
    }
    for (const item of unCheckedItems) {
      await data.update(
        {
          check: false,
        },
        {
          where: { id: item.id, user_id: req.user.id },
        }
      );
    }
    return res.status(200).json({ result: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { items, model } = req.body;
    console.log("디버그", items);
    let data;
    if (model == "NutritionPlan") data = NutritionPlan;
    if (model == "ExercisePlan") data = ExercisePlan;
    for (const item of items) {
      await data.destroy(
        {
          where: { id: item.id },
        }
      );
    }
    return res.status(200).json({ result: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

export { indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile, profileChart, aiPlan, checkPost, deletePost };
