import ExercisePlanner from "../models/ExercisePlan";
import NutritionPlanner from "../models/NutritionPlan";

const createPlan = async (req, res, next, model) => {
  try {
    const { plan } = req.body;
    console.log('플랜확인:', plan);
    console.log('길이 확인:', plan.length);

    // Plan 배열의 각 요소에 대해 DB에 저장
    for (let i = 0; i < plan.length; i++) {
      const { createdAt } = plan[i];
      let additionalData = {};

      if (model === NutritionPlanner) {
        const { name, calorie = 0, protein = 0, fat = 0, cho = 0 } = plan[i];
        additionalData = {
          name,
          calorie: calorie !== null ? calorie : 0, // 혹여 null값이 전달 되도 0이 입력되게 끔
          protein: protein !== null ? protein : 0,
          fat: fat !== null ? fat : 0,
          cho: cho !== null ? cho : 0
        }
      } else if (model === ExercisePlanner) {
        const { type, count, set } = plan[i];
        additionalData = { type, count, set };
      }

      await model.create({
        user_id: req.user.id,
        createdAt,
        ...additionalData,
      });
    }
    res.status(200).json({ message: `plan created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createExercisePlan = async (req, res, next) => {
  await createPlan(req, res, next, ExercisePlanner);
};

export const createNutritionPlan = async (req, res, next) => {
  await createPlan(req, res, next, NutritionPlanner);
};

export const planCheck = async (req, res, next) => {
  try {
    const { date, partition } = req.body;
    let model;
    let message;

    if (partition === 'exercise') {
      model = ExercisePlanner;
      message = "exercisePlan";
    } else if (partition === 'nutrition') {
      model = NutritionPlanner;
      message = "nutritionPlan";
    }

    const existingPlan = await model.findOne({
      user_id: req.user.id,
      createAt: date,
    });

    if (existingPlan) {
      // 이미 해당 날짜에 계획이 있는 경우
      res.status(200).json({ message: `${message} already exists.`, confirm: false });
    } else {
      // 해당 날짜에 계획이 없는 경우
      res.status(200).json({ message: `${message} does not exist.`, confirm: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};