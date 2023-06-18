import Board from "../models/Board";
import Comment from "../models/Comment";

// 投稿全体の読み込み
export const indexBoard = async(req, res, next) => {
    try{
        let {page, limit} = req.params;
        if (!limit || !page)
        return res.status(400).json({ message: '必須値が欠落しています。' });
        page = parseInt(page); // paramsに来る時は全て{page: '10'}式で値が全て文字列で来るので変えなければならない。
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
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}

// 投稿閲覧
export const showBoard = async(req, res, next) => {
    try{
        const {id} = req.params;
        if (!id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}
// 投稿する
export const createBoard = async(req, res, next) => {
    try{
        const {title, content, category} = req.body
        if (!title || !content)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}
// 投稿編集
export const updateBoard = async(req, res, next) => {
    try{
        const {title, content, id, category} = req.body
        if (!title || !content || !id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
    return  res.status(403).json({message: "当該リソースにアクセスする権限がありません。"})
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}

// 投稿削除
export const deleteBoard = async(req, res, next) => {
    try{
        const {id} = req.body
        if (!id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
    return  res.status(403).json({message: "当該リソースにアクセスする権限がありません。"})
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}

// コメントする
export const createComment = async(req, res, next) => {
    try{
        const {content, board_id} = req.body
        if (!content || !board_id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}
// コメント編集
export const updateComment = async(req, res, next) => {
    try{
        let {content, id, board_id} = req.body
        if (!board_id || !content || !id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
        content += " (수정됨)" // 該当コメントが編集されたコメントなのか表示するためのコード
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
    return  res.status(403).json({message: "当該リソースにアクセスする権限がありません。"})

    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}

// コメント削除
export const deleteComment = async(req, res, next) => {
    try{
        const {id} = req.body
        if (!id)
        return res.status(400).json({ message: '必須値が欠落しています。' });
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
        return  res.status(403).json({message: "当該リソースにアクセスする権限がありません。"})

    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'サーバーエラーが発生しました。'});
    }
}
