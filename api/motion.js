const express = require('express');
const router  = express.Router();
const sequelize = require('sequelize');
// const {Motion} = require('../models');


router.post('/save', async(req,res,next) => {
    const{DESC_KOR, ANIMAL_PLANT, NUTR_CONT1, SERVING_WT, NUTR_CONT2, NUTR_CONT3, 
        NUTR_CONT4, NUTR_CONT5, NUTR_CONT6, NUTR_CONT7, NUTR_CONT8, NUTR_CONT9} = req.body;
    try{
        const newHistory = await History.create({
            DESC_KOR, 
            ANIMAL_PLANT, 
            NUTR_CONT1, 
            SERVING_WT, 
            NUTR_CONT2, 
            NUTR_CONT3, 
            NUTR_CONT4, 
            NUTR_CONT5, 
            NUTR_CONT6, 
            NUTR_CONT7, 
            NUTR_CONT8, 
            NUTR_CONT9
        });
        res.send("<script>alert('저장 완료.');</script>");
    }catch(error){
        res.send("<script>alert('저장 실패');</script>");
        console.log(error);
    }
})
module.exports = router;