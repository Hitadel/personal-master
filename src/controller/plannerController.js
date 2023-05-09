// const { Planner } = require("../models");
import Planner from "../models/ExercisePlan";

// exports.createExercisePlan = async (req, res, next) => {
//   try {
//     const { plan } = req.body;
//     const parsedPlan = JSON.parse(plan);
//     console.log('플랜확인:',parsedPlan);
//     console.log('길이 확인:',parsedPlan.length)
    
//     // const user_id = req.user.id; // 사용자 ID는 인증된 사용자로부터 얻을 수 있어야 함

//     // Plan 배열의 각 요소에 대해 DB에 저장
//     for (let i = 0; i < parsedPlan.length; i++) {
//       const { date, exercise, set, count } = parsedPlan[i];
//       await Planner.create({
//         user_id: req.user.id,
//         date,
//         exercise,
//         set,
//         count,
//       });
//     }

//     res.status(200).json({ message: "Exercise plan created successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
export const createExercisePlan = async(req, res, next) => {
  try {
    const { plan } = req.body;
    const parsedPlan = JSON.parse(plan); // plan을 파싱하여 JSON 객체로 변환
    console.log('플랜확인:',parsedPlan);
    console.log('길이 확인:',parsedPlan.length)
    // const user_id = req.user.id; // 사용자 ID는 인증된 사용자로부터 얻을 수 있어야 함
    // Plan 배열의 각 요소에 대해 DB에 저장
    for (let i = 0; i < parsedPlan.length; i++) {
      const { date, exercise, set, count } = parsedPlan[i];
      await Planner.create({
        user_id: req.user.id,
        date,
        exercise,
        set,
        count,
      });
    }

    res.status(200).json({ message: "Exercise plan created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}