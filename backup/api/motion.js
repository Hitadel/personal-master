const express = require('express');
const router  = express.Router();
const sequelize = require('sequelize');
const Motions = require('../models/Motions');


router.post('/save', async(req,res,next) => {
    const{type, count, time, score} = req.body;
    try{
        const newMotions = await Motions.create({
            type, count, time, score
        });
        res.send("<script>alert('저장 완료.');</script>");
    }catch(error){
        res.send("<script>alert('저장 실패');</script>");
        console.log(error);
    }
})
module.exports = router;