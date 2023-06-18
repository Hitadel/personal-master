import Motion from "../models/Motion";

// 運動の記録を保存するコントローラー
export const saveMotion = async (req, res, next) => {
  try {
    // type - 運動名 / count - 回数 / time - 運動時間 / score - 点数
    const { type, count, time, score } = req.body;

    await Motion.create({
      // motion テーブルにデータ追加
      user_id: req.user.id,
      type,
      count,
      timer: time,
      score,
    });
    
    return res.status(200).json({message: "SUCCESS"});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
