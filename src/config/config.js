export default {
  development: {
    username: process.env.DEV_USERNAME, // MySQL ID
    password: process.env.DEV_PASSWORD, // MySQL Password
    database: process.env.DEV_DATABASE, // MySQL Table Name
    host: process.env.DEV_HOST, // 127.0.0.1 or localhost
    dialect: process.env.DEV_DIALECT, // MySQL
    dateStrings: true, // Stringで日付を受け取ることができる
     timezone: "+9:00", // GMT基準で韓国の時間
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
