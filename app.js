const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

// place holder for the data
const users = [];
const cors = require('cors')

//라우팅
const barcode = require('./api/barcode');
app.use('/api/barcode', barcode);
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