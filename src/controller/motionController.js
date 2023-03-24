import Motion from "../models/Motion";

// Motion 저장 컨트롤러
export const saveMotion = async (req, res, next) => {
  try {
    // type - 운동명 / count - 갯수 / time - 운동 시간 / score - 점수
    const { type, count, time, score } = req.body;

    await Motion.create({
      // motion 테이블에 데이터 추가
      user_id: req.user.id,
      type,
      count,
      time,
      score,
    });

    // 성공 시 클라이언트로 "SUCCESS" 메시지 응답
    return res.status(200).json({message: "SUCCESS"});
  } catch (err) {
    console.error(err);
    next(err);
  }
};
