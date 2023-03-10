import Motion from "../models/Motion";
import { decodeToken } from "../../util/token";

// Motion 저장 컨트롤러
export const saveMotion = async (req, res, next) => {
  try {
    // type - 운동명 / count - 갯수 / time - 운동 시간 / score - 점수
    const { type, count, time, score } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? decodeToken(token) : null;
    if (!decoded || !decoded.user) 
      return res.status(401).json({ message: "Invalid token" });

    await Motion.create({
      // motion 테이블에 데이터 추가
      user_id: decoded.user.id,
      type,
      count,
      time,
      score,
    });

    // 성공 시 클라이언트로 "SUCCESS" 메시지 응답
    return res.status(200).json("SUCCESS");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
