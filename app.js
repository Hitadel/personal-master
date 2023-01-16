const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

// place holder for the data
const users = [];
const cors = require('cors')


//라우팅
const { sequelize } = require('./models');
const barcode = require('./api/barcode');
app.use('/api/barcode', barcode);
const qna = require('./api/qna');
app.use('/api/barcode', qna);
const motion = require('./api/motion');
app.use('/api/motion', motion);
//라우팅

app.use(cors({ credentials: true, origin: "http://localhost:3080" }));
app.use(bodyParser.json());


app.get('/api/test', (req, res) => {
    console.log("테스트");
    res.send("done");
});

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.error(err);
});
