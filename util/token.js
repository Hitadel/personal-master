import jwt from 'jsonwebtoken';

  
  // JWT 토큰을 검증하여 사용자 정보를 추출하는 함수
  export const decodeToken = (token) => {
    const secret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    return decoded;
  };