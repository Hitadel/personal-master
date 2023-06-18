import ExercisePlanner from "../models/ExercisePlan";
import NutritionPlanner from "../models/NutritionPlan";

const createPlan = async (req, res, next, model) => {
  try {
    const { plan } = req.body;
    console.log('プラン確認:', plan);
    console.log('長さ確認:', plan.length);

    // Plan配列の各要素をDBに保存
    for (let i = 0; i < plan.length; i++) {
      const { createdAt } = plan[i];
      let additionalData = {};

      if (model === NutritionPlanner) {
        const { name, calorie = 0, protein = 0, fat = 0, cho = 0 } = plan[i];
        additionalData = {
          name,
          calorie: calorie !== null ? calorie : 0, // もしやnull値が渡されても0が入力されるように
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
  where: {
    user_id: req.user.id,
    createdAt: date,
  },
});

    if (existingPlan) {
      // すでにその日に計画がある場合
      res.status(200).json({ message: `${message} already exists.`, confirm: false });
    } else {
      // その日に計画がない場合
      res.status(200).json({ message: `${message} does not exist.`, confirm: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
