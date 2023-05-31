export default {
  development: {
    username: process.env.DEV_USERNAME, // mysql ID
    password: process.env.DEV_PASSWORD, // mysql Password
    database: process.env.DEV_DATABASE, // mysql Table Name
    host: process.env.DEV_HOST, // 127.0.0.1 or localhost
    dialect: process.env.DEV_DIALECT, // mysql
    dateStrings: true, // String으로 날짜를 받을 수 있음
     timezone: "+9:00", // GMT 기준 한국 시간
    // logging: false
  },
  test: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: "",
  },
  production: {
    username: process.env.PRODUCT_USERNAME,
    password: process.env.PRODUCT_PASSWORD,
    database: process.env.PRODUCT_DATABASE,
    host: process.env.PRODUCT_HOST,
    dialect: process.env.PRODUCT_DIALECT,
  },
};
