import Barcode from "../models/Barcode";

router.post('/select', async(req,res,next) => {
    // const {barcode_id} = req.body;
    // let barcode_id = req.query.barcode_id;
    let {barcode_id} = req.query;
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
            const result2 = 0;
        }
    } else
    result2 = 0;
    return res.json({'result':result2});
    }catch(err){
        console.log(err);
    }
})

router.post('/save', async(req,res,next) => {
    const{DESC_KOR, ANIMAL_PLANT, NUTR_CONT1, SERVING_WT, NUTR_CONT2, NUTR_CONT3, 
        NUTR_CONT4, NUTR_CONT5, NUTR_CONT6, NUTR_CONT7, NUTR_CONT8, NUTR_CONT9} = req.body;
    try{
        const newBarcode = await Barcode.create({
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