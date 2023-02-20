import Board from "../models/Board";
import { Sequelize } from "sequelize";

export const indexBoard = async(req, res, next) => {
    try{
        let {page, limit} = req.params;
        page = parseInt(page); //params로 넘어올 땐 전부 {page: '10'} 식으로 값이 모두 문자열로 오니까 바꿔줘야됨
        limit = parseInt(limit);
        const result = await Board.findAll(
        {
            order: [['id', 'DESC']],
            limit,
            offset: (page-1) * limit
        },
        )
        return res.status(200).json({result});
    }catch(err){
        console.error(err);
        next(err);
    }
}
export const showBoard = async(req, res, next) => {
    try{
        const {id} = req.params;
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