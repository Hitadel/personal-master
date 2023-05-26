import User from "../models/User";
import Post from "../models/Post";
import Hashtag from "../models/Hashtag";
import Follow from "../models/Follow";
import Images from "../models/Images";
import Comment from "../models/Comment";

export const createPost = async (req, res, next) => {
  try {
    const { content, hashtags, imageUri } = req.body;

    const user_info = await User.findOne({ where: { id: req.user.id } });

    const post = await Post.create({
      content,
      user_id: user_info.sns_id,
    });

    await Images.create({
      type: "post",
      url: imageUri,
      user_id: user_info.sns_id,
      post_id: post.dataValues.id,
    });

    if (hashtags.length > 0) {
      hashtags.map((value) => {
        Hashtag.create({
          content: value,
          post_id: post.dataValues.id,
        });
      });
    }

    // 이미지 URL 추가하는 코드 만들어야함

    console.log(post.dataValues.id);

    return res.status(200).json({ message: "작성 완료" });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getPost = async (req, res, next) => {
  try {
    const user_info = await User.findOne({ where: { id: req.user.id } });

    const follow_info = await Follow.findAll({ where: { follower_id: user_info.sns_id } });

    if (follow_info.length > 0) {
      const following = [];
      follow_info.map((value) => {
        following.push(value.dataValues.following_id);
      });
      console.log(following);

      const posts = await Post.findAll({
        where: {
          user_id: following,
        },
        order: [["id", "DESC"]],
      });

      const images = await Images.findAll({
        where: {
          user_id: following,
        },
        order: [["post_id", "DESC"]],
      });

      console.log(posts);

      if (posts.length === 0) {
        return res.status(200).json({ message: "팔로잉 하는 계정 중 게시글을 올린 계정이 없습니다." });
      }

      return res.status(200).json({ posts, images });
    }

    return res.status(200).json({ message: "팔로잉 하는 계정 중 게시글을 올린 계정이 없습니다." });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getDetail = async (req, res, next) => {
  try {
    const { id } = req.query;
    const detail = await Post.findOne({
      where: { id },
    });

    const hashtag = await Hashtag.findAll({
      where: { post_id: id },
    });

    const image = await Images.findOne({
      where: { post_id: id },
    });

    console.log(image);

    return res.status(200).json({ detail, hashtag, image });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { id } = req.query;
    const comments = await Comment.findAll({
      where: { post_id: id },
    });

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    next();
  }
};

export const createComments = async (req, res, next) => {
  try {
    const { content, post_id } = req.body;

    const user_info = await User.findOne({ where: { id: req.user.id } });

    await Comment.create({
      content,
      post_id,
      user_id: user_info.sns_id,
    });

    const comments = await Comment.findAll({
      where: { post_id },
    });

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    next();
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { post_id, writer } = req.body;

    const user_info = await User.findOne({ where: { id: req.user.id } });
    if (user_info.sns_id === writer) {
      await Post.destroy({
        where: { id: post_id },
      });
    } else {
      res.status(201).json({ message: "작성자만 삭제할 수 있습니다." });
    }

    res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id, writer } = req.body;
    const user_info = await User.findOne({
      where: { id: req.user.id },
    });
    if (user_info.sns_id === writer) {
      await Comment.destroy({
        where: { id },
      });
    } else {
      res.status(201).json({ message: "작성자만 삭제할 수 있습니다." });
    }

    res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    next();
  }
};
