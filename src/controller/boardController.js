// import Board from "../models/Board";
// const express = require('express');
// const router = express.Router();
// const sequelize = require('sequelize');
// // const {Qna} = require('../models');

// router.get('/', async (req, res, next) => {
//     const qna_page = req.query.qna_page;
//     try{
//         let apiResult = await Qnas.findAll({
//             raw:true,
//             attributes:['id', 'title','body', 'user_id', 'user_name',
//                 [sequelize.fn('date_format', sequelize.col('article_at'), '%y-%m-%d'), 'created_at']],
//             order: [['article_id', 'DESC']],
//             limit: 10,
//             offset: (qna_page) * 10
//         })
//         res.json({
//             apiResult
//         });
//         return res.redirect('/qna/main');
//     } catch (error) {
//         console.log(error);
//     }
// })
// module.exports = router;