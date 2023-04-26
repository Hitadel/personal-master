import Board from "../models/Board";
import Comment from "../models/Comment";

export const indexBoard = async(req, res, next) => {
    try{
        let {page, limit} = req.params;
        if (!limit || !page)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        page = parseInt(page); //params로 넘어올 땐 전부 {page: '10'} 식으로 값이 모두 문자열로 오니까 바꿔줘야됨
        limit = parseInt(limit);
        const board = await Board.findAndCountAll({
            order: [['id', 'DESC']],
            limit,
            offset: (page-1) * limit
          });
          const count = board.count;
          const rows = board.rows;
          return res.status(200).json({ count, rows });
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}
export const showBoard = async(req, res, next) => {
    try{
        const {id} = req.params;
        if (!id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        const board = await Board.findOne({
            where: {id}
        })
        await Board.update({
            hit: board.hit + 1
        },  {where: {id}} )
        const comment = await Comment.findAll(
            {   
                where: {board_id: id},
            },
            )
        return res.status(200).json({board, comment});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}
export const createBoard = async(req, res, next) => {
    try{
        const {title, content, category} = req.body
        if (!title || !content)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        await Board.create({
            title,
            content,
            category,
            user_id: req.user.id,
            user_name: req.user.name,
        })
        return res.status(200).json({result: true});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}

export const updateBoard = async(req, res, next) => {
    try{
        const {title, content, id} = req.body
        if (!title || !content || !id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
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
        return res.status(200).json({result: true});
    }
    else 
    return  res.status(403).json({message: "해당 리소스에 접근할 권한이 없습니다."})
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}

// export const likeBoard = async(req, res, next) => {
//     try{
//         const {like, id} = req.body
//         if (!like || !id)
//         return res.status(400).json({ message: '필수값이 누락되었습니다.' });
//         const result = await Board.update({
//             like: like + 1
//         },
//             {where: {id}}
//     )
//         return res.status(200).json({result: true});
//     }catch(err){
//         console.error(err);
//         return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
//     }
// }

export const deleteBoard = async(req, res, next) => {
    try{
        const {id} = req.body
        if (!id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        const board = await Board.findOne({
            where: {id}
        });
        if (board.user_id == req.user.id) {
        await Board.destroy({
            where: {id}
        })
        await Comment.destroy({
            where: {board_id: id}
        })
        return res.status(200).json({result: true});
    }
    else 
    return  res.status(403).json({message: "해당 리소스에 접근할 권한이 없습니다."})
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}

export const createComment = async(req, res, next) => {
    try{
        const {content, board_id} = req.body
        if (!content || !board_id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        const result = await Comment.create({
            content,
            user_id: req.user.id,
            user_name: req.user.name,
            board_id,
        });
        const comment = await Comment.findAll({
            where: {board_id}
        });
        return res.status(200).json({comment});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}

export const updateComment = async(req, res, next) => {
    try{
        let {content, id, board_id} = req.body
        if (!board_id || !content || !id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        content += " (수정됨)"
        const comment = await Comment.findOne({
            where: {id}
        });
        if (comment.user_id == req.user.id) {
        await Comment.update({
            content,
            user_id: req.user.id,
            user_name: req.user.name,
            board_id,
        },
            {where: {id}}
    )
        return res.status(200).json({result: true});
    }
    else 
    return  res.status(403).json({message: "해당 리소스에 접근할 권한이 없습니다."})

    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}

export const deleteComment = async(req, res, next) => {
    try{
        const {id} = req.body
        if (!id)
        return res.status(400).json({ message: '필수값이 누락되었습니다.' });
        const comment = await Comment.findOne({
            where: {id}
        })
        if (comment.user_id == req.user.id) {
            const result = await Comment.destroy({
                where: {id}
            })
            return res.status(200).json({result: true});
        }
        else 
        return  res.status(403).json({message: "해당 리소스에 접근할 권한이 없습니다."})

    }catch(err){
        console.error(err);
        return res.status(500).json({message: '서버 에러가 발생하였습니다.'});
    }
}
