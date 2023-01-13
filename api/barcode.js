const express = require('express');
const router  = express.Router();
const sequelize = require('sequelize');


router.get('/', async(req,res,next) => {
    // const{query1, query2} = req.body;
    try{
        // let apiResult = await Article.findAll({
        //     raw:true,
        //     attributes:['article_id','article_title', 'useremail', 'category', 'article_content',
        //         [sequelize.fn('date_format', sequelize.col('article_at'), '%Y-%m-%d'), 'article_at']],
        //     order: [['article_id', 'DESC']],
        //     limit: 10,
        //     offset: (qna_page-1) * 10
        // })
        // res.json({
        //     apiResult, apiResult2, nameArray
        // })
        console.log("예시입니다.");
        // return res.redirect('/main');
    }catch(error){
        console.log(error);
    }
})

router.get('/select', async(req,res,next) => {
    const {barcode_id} = req.body;
    try{
        // $user = auth()->User();
        // if ($user != null)
        // $permission = true;
        // else        
        // $permission = false;
        if (barcode_id != null){
        const api = Http.get("http://openapi.foodsafetykorea.go.kr/api/fc67310cce3340bf8ed3/C005/xml/1/1/BAR_CD=${req}");
        const xml = simplexml_load_string(api);
        const json = json_encode(xml);
        const array = json_decode(json, TRUE);
        if (array["RESULT"]["MSG"] != "해당하는 데이터가 없습니다.") {
            const result = array['row']['PRDLST_NM'];
            const api2 = Http.get("http://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1?serviceKey={servicekey}&desc_kor={result}&type=xml");
            const xml2 = simplexml_load_string(api2);
            const json2 = json_encode(xml2);
            const array2 = json_decode(json2, TRUE);
            const result2 = array2['body']['items']['item'][0];
        } else {
            result2 = 0;
        }
    } else
    result2 = 0;
    return res.json({'result':result2});
    }catch(err){
        console.log(err);
    }
})

router.get('/test', async(req,res,next) => {
    try{
        console.log("테스트");
    }catch(error){
        console.log(error);
    }
})
module.exports = router;