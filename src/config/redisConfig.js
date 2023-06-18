// redisの設定
const redis = require('redis');
const redisClient = redis.createClient({ // .envで作成した変数を使用
    socket: { // 外部アクセス(他のホスト(Host))のためには必ずソケット(Socket)で縛る必要がある
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD,
  });

module.exports = redisClient;
  
