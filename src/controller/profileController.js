import Status from "../models/Status";
import Motion from "../models/Motion";
import User from "../models/User";
import Nutrition from "../models/Nutrition";
import ExercisePlan from "../models/ExercisePlan";
import NutritionPlan from "../models/NutritionPlan";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisConfig";
import { createHashedPassword } from "../utils/crypto";
const { Op } = require("sequelize");

// プロフィール情報の取得
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// 個人情報の修正
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
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
    } else return res.status(401).json({ message: "パスワードが間違っています。" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// パスワードの修正
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// 身体情報の修正
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// profileChartとaiPlanで使われる関数
// dateとperiodは機関の条件、reqはユーザー情報
// modelはモデル名、modelConditionとtypeはMotionモデルで使われるwhere句の条件である
const modelPeriodCalculator = async (date, req, period, model, modelCondition, type) => {
  let condition = 24 * 60 * 60 * 1000; // 一日後にするための条件(24時間)
  const startDate = new Date(Date.parse(date) + condition - 1); // 23:59:59
  condition *= period; // 期間の条件
  const condition1 = new Date(startDate.getTime() - condition); // 開始
  const condition2 = startDate; // 終了
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

// frameworkはDBから取得した基準(変数timeとtimeIndex)が一致するデータであり、frameworkで必要なキーと値だけを抽出してinputに入れる過程
const addModelToResult = (input, framework, timeIndex) => {
  Object.keys(input[timeIndex]).forEach((key) => {
    // 必要なキーと値はinputにあらかじめ組んでおいたキーと値なので、includesを使ってinputに含まれるキーだけをframeworkで探して入れている
    if (Object.keys(framework).includes(key)) {
      if (key == "createdAt" || key == "type") input[timeIndex][key] = framework[key];
      else input[timeIndex][key] += framework[key];
    }
  });
  return input[timeIndex];
};

// DBから取り寄せた値の中で、基準(変数time)が一致する場合食品の栄養素または運動のカウント個数を合わせてinputに入れる過程
// 期間が一致するかどうかは、timeIndexで決定
const forEachFunction = (model, input, period, date) => {
  let startDate, endDate, time, timeIndex;
  if (period == "week") {
    startDate = new Date(Date.parse(date)); // 指定日
    endDate = new Date(startDate.getTime() - 6 * 24 * 60 * 60 * 1000).getDate(); // ユーザーが決めた日から1週間前
  }
  model.forEach((instances) => {
    if (period === "day") time = new Date(instances.createdAt).getHours(); // 一日分が必要な場合は、基準を時間にする
    else if (period === "year")time = new Date(instances.createdAt).getMonth() + 1; // 一年分が必要な場合は、基準を月別にする
    else time = new Date(instances.createdAt).getDate(); // 一週間分や一ヶ月分が必要な場合は、日付を基準とする
    if (period === "day") { // ユーザーが一日分のデータが必要な場合
      if (time >= 0 && time < 5) // DBから取得したcreatedAtの時間帯(上で定めた基準 = time)が0:00時から5:00時の間の場合、timeIndexを3と定める
        // 夜
        input[3] = addModelToResult(input, instances.dataValues, 3);
      else if (time >= 5 && time < 11)
        // 朝
        input[0] = addModelToResult(input, instances.dataValues, 0);
      else if (time >= 11 && time < 17)
        // 昼
        input[1] = addModelToResult(input, instances.dataValues, 1);
      else if (time >= 17 && time <= 23)
        // 夕
        input[2] = addModelToResult(input, instances.dataValues, 2);
      return input;
    } else {
      if (period === "week") { // ユーザーが1週間分のデータが必要な場合
        let currentDay = instances.createdAt.getDate(); // 現在計算しているDBデータの日付
        // 一週間前の日付が現在の日付より大きい場合は、1ヶ月前の日付という場合である(例えば、5月「25日」 (endDate) > 6月「1日」 (currentDay))
        if (endDate > currentDay) { // 1ヶ月前(29日、30日、31日など)の日付を読み込む場合
          let modifiedEndDate = new Date(instances.createdAt.getFullYear(), instances.createdAt.getMonth(), 0).getDate() - endDate;
          timeIndex = currentDay + modifiedEndDate;
        } else timeIndex = currentDay - endDate; // 正常に読み込む場合(例えば、5月20日 (endDate) < 5月27日 (currentDay))
      } else if (period === "month") { // ユーザーが1ヶ月分のデータが必要な場合
        if (time <= 0 || time > 31) return; // 間違った日付は無視
        timeIndex = time - 1; // 日付に合ったインデックスを計算
      } else { // ユーザーが1年分のデータが必要な場合
        if (time <= 0 || time > 12) return;
        timeIndex = time - 1;
      }
      return (input[timeIndex] = addModelToResult(input, instances.dataValues, timeIndex));
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
        time: ["아침", "점심", "저녁", "새벽"],
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

    // resultはrechartで使われる形式のオブジェクトの配列
    // 以下は空の値の値のオブジェクトフォーマットを作成するプロセス
    result = Array.from({ length: resultLength }, (_, i) => ({
      time: period === "day" ? schema.time[i] : `${i + 1}${period === "week" || period == "month" ? "일" : "월"}`,
      ...schema.fields.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {}),
      ...(schema.createdAt !== undefined && { createdAt: 0 }),
    }));

    // プロフィールデータはモデルから取得する値である
    // パラメータでモデルの条件を渡っている
    let profileData = await modelPeriodCalculator(date, req, period2, data, category, type);
    // forEachFunctionは配列result内部のオブジェクトが持つキーの値を満たす役割
    // forEachFunction内部で使用されるinputというパラメータで配列を修正しても、resultとinputは同じ配列を指しているため
    // 配列の内容は修正される
    forEachFunction(profileData, result, period, date); 
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "サーバーエラーが発生しました。"  });
  }
};

// profileChartと同じようにRechartで使うデータを取得する関数
// なので、ロジックはほぼ同じ
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
    else { // 運動と栄養素の両方の計画が一度に必要な場合
      category = undefined;
      nutrition = await modelPeriodCalculator(date, req, period2, NutritionPlan)
      exercise = await modelPeriodCalculator(date, req, period2, ExercisePlan)
      // NutritionPlanとExercisePlanは従来のNutritionやMotionモデルとは異なり、
      // 最初からRechartで必要とされるデータだけを含んでいるため、再加工する必要はない
      return res.status(200).json({nutrition, exercise})
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// AIプランチェックの有無を保存
const checkPost = async (req, res, next) => {
  try {
    const { items, unCheckedItems, model } = req.body;
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// AIプラン削除有無を保存
const deletePost = async (req, res, next) => {
  try {
    const { items, model } = req.body;
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
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

export { indexProfile, personalModifyProfile, passwordConfirmProfile, passwordModifyProfile, statusModifyProfile, profileChart, aiPlan, checkPost, deletePost };
