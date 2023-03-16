import Board from "../models/Board";
import Comment from "../models/Comment";

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
        const data = await Board.findOne({
            where: {id}
        })
        await Board.update({
            hit: data.hit + 1
        },  {where: {id}} )
        const comment = await Comment.findAll(
            {   
                where: {board_id: id},
            },
            )
        return res.status(200).json({data, comment});
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
        const result2 = await Board.findOne({
            where: {id}
        });
        if (result2.user_id == req.user.id) {
        const result = await Board.update({
            title,
            content,
            category,
            user_id: req.user.id,
            user_name: req.user.name,
        },
            {where: {id}}
    )
        return res.status(200).json("SUCCESS");
    }
    else 
    return  res.status(403).send("해당 리소스에 접근할 권한이 없습니다.");
    }catch(err){
        console.error(err);
        next(err);
    }
}

export const likeBoard = async(req, res, next) => {
    try{
        const {like, id} = req.body
        const result = await Board.update({
            like: like + 1
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
        const result2 = await Board.findOne({
            where: {id}
        });
        if (result2.user_id == req.user.id) {
        const result = await Board.destroy({
            where: {id}
        })
        return res.status(200).json("SUCCESS");
    }
    else 
    return  res.status(403).send("해당 리소스에 접근할 권한이 없습니다.");
    }catch(err){
        console.error(err);
        next(err);
    }
}

export const createComment = async(req, res, next) => {
    try{
        const {content, board_id} = req.body
        const result = await Comment.create({
            content,
            user_id: req.user.id,
            user_name: req.user.name,
            board_id,
        });
        const data = await Comment.findAll({
            where: {board_id}
        });
        return res.status(200).json(data);
    }catch(err){
        console.error(err);
        next(err);
    }
}

export const updateComment = async(req, res, next) => {
    try{
        let {content, id, board_id} = req.body
        content += " (수정됨)"
        
        const result2 = await Comment.findOne({
            where: {id}
        });
        if (result2.user_id == req.user.id) {
        const result = await Comment.update({
            content,
            user_id: req.user.id,
            user_name: req.user.name,
            board_id,
        },
            {where: {id}}
    )
        return res.status(200).json("SUCCESS");
    }
    else 
    return  res.status(403).send("해당 리소스에 접근할 권한이 없습니다.");

    }catch(err){
        console.error(err);
        next(err);
    }
}

export const deleteComment = async(req, res, next) => {
    try{
        const {id} = req.body
        const result2 = await Comment.findOne({
            where: {id}
        })
        if (result2.user_id == req.user.id) {
            const result = await Comment.destroy({
                where: {id}
            })
            return res.status(200).json("SUCCESS");
        }
        else 
        return  res.status(403).send("해당 리소스에 접근할 권한이 없습니다.");

    }catch(err){
        console.error(err);
        next(err);
    }
}
