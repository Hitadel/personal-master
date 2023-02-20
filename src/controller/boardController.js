import Board from "../models/Board";

export const indexBoard = async(req, res, next) => {
    try{
        const result = await Board.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
        })
        return res.status(200).json({result});
    }catch(err){
        console.error(err);
        next(err);
    }
}
export const showBoard = async(req, res, next) => {
    try{
        const {id} = req.body
        const result = await Board.findOne({
            where: {id}
        })
        return res.status(200).json({result});
    }catch(err){
        console.error(err);
        next(err);
    }
}
export const createBoard = async(req, res, next) => {
    try{
        const {title, content, category} = req.body
        const result = await Board.create({
            title,
            content,
            category,
            user_id: req.user.id,
            user_name: req.user.name,
            // user_id: req.body.id, //테스트용
            // user_name: req.body.name, //테스트용
        })
        return res.status(200).json("SUCCESS");
    }catch(err){
        console.error(err);
        next(err);
    }
}
export const updateBoard = async(req, res, next) => {
    try{
        const {title, content, category, id} = req.body
        const result = await Board.update({
            title,
            content,
            category,
            user_id: req.user.id,
            user_name: req.user.name,
            // user_id: req.body.user_id, //테스트용
            // user_name: req.body.user_name, //테스트용
        },
            {where: {id}}
    )
        return res.status(200).json("SUCCESS");
    }catch(err){
        console.error(err);
        next(err);
    }
}
export const deleteBoard = async(req, res, next) => {
    try{
        const {id} = req.body
        const result = await Board.destroy({
            where: {id}
        })
        return res.status(200).json("SUCCESS");

    }catch(err){
        console.error(err);
        next(err);
    }
}