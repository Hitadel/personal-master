var mysql = require('mysql');
var db = mysql.createConnection({ // 접속을 위한 정보 전달
  host:'localhost',
  user: 'root',
  password: 'root1234',
  database: 'opentutorials'
});
db.connect();

module.exports = db; // 외부로 꺼낼 api가 하나일때