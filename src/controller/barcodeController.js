// フロントから受け取った栄養情報をNutritionテーブルに保存

import Nutrition from "../models/Nutrition";

export const saveBarcode = async (req, res, next) => {
  try {
    // このfor文はフロントから受け取った栄養情報の中から、数字で受け取るべき情報（カロリーなど）が漏れがある場合、
    // NaNに伝達されエラーが発生します。 
    // それを防止するために数字で受け取る情報だけを抽出し、
    // NaNの場合は0に変えるコードです。
    for (const key in req.body.data){
      if(key == "DESC_KOR" || key == "ANIMAL_PLANT")
      continue;
      if(isNaN(req.body.data[key]))
      req.body.data[key] = 0
    }
    const { DESC_KOR, SERVING_WT, NUTR_CONT1, NUTR_CONT2, NUTR_CONT3, NUTR_CONT4, NUTR_CONT5, NUTR_CONT6, NUTR_CONT7, NUTR_CONT8, NUTR_CONT9, ANIMAL_PLANT } =
      req.body.data;
    await Nutrition.create({
      name: DESC_KOR,
      user_id: req.user.id,
      manufacturer: ANIMAL_PLANT,
      size: SERVING_WT,
      calorie: NUTR_CONT1,
      cho: NUTR_CONT2,
      protein: NUTR_CONT3,
      fat: NUTR_CONT4,
      sugars: NUTR_CONT5,
      salt: NUTR_CONT6,
      chole: NUTR_CONT7,
      satur_fat: NUTR_CONT8,
      trans_fat: NUTR_CONT9,
    });
    return res.status(200).json({message: "SUCCESS"});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
