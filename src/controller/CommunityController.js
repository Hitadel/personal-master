import sequelize, { Op } from "sequelize";
import User from "../models/User";
import Post from "../models/Post";
import Follow from "../models/Follow";
import Images from "../models/Images";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await User.findOne({
      attributes: ["sns_id", "name"],
      where: { id: req.user.id },
    });

    if (!profile.sns_id) {
      return res.status(200).json({ message: "SNSアカウントが存在しません。", type: "no_account" });
    }

    const images = await Images.findAll({
      where: { user_id: profile.sns_id },
    });

    const posts = await Post.findAll({
      where: { user_id: profile.sns_id },
    });

    const following = await Follow.count({
      where: { following_id: profile.sns_id },
    });

    const follower = await Follow.count({
      where: { follower_id: profile.sns_id },
    });

    return res.status(200).json({ profile, posts, following, follower, images });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getOtherProfile = async (req, res, next) => {
  try {
    const { sns_id } = req.body;

    const profile = await User.findOne({
      attributes: ["sns_id", "name"],
      where: { sns_id },
    });

    const posts = await Post.findAll({
      where: { user_id: sns_id },
    });

    const follower = await Follow.count({
      where: { follower_id: sns_id },
    });

    const following = await Follow.count({
      where: { following_id: sns_id },
    });

    const isFollow = await Follow.findOne({
      where: { follower_id: sns_id },
    });

    const images = await Images.findAll({
      where: { user_id: profile.sns_id },
    });

    return res.status(200).json({ profile, posts, follower, following, isFollow, images });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const follow = async (req, res, next) => {
  try {
    const { sns_id, isFollowing } = req.body;

    const profile = await User.findOne({
      attributes: ["sns_id", "name"],
      where: { id: req.user.id },
    });

    if (isFollowing) {
      await Follow.destroy({
        where: {
          following_id: profile.sns_id,
          follower_id: sns_id,
        },
      });
    } else {
      await Follow.create({
        following_id: profile.sns_id,
        follower_id: sns_id,
      });
    }

    const follower = await Follow.count({
      where: { follower_id: sns_id },
    });

    const following = await Follow.count({
      where: { following_id: sns_id },
    });

    return res.status(200).json({ follower, following });
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getSearch = async (req, res, next) => {
  try {
    const { content, mode } = req.body;
    if (mode === "user") {
      const users = await User.findAll({
        attributes: ["sns_id", "name"],
        where: {
          sns_id: {
            [Op.like]: `%${content}%`,
          },
        },
      });

      if (users) {
        return res.status(200).json(users);
      } else {
        return res.status(200).json({ message: "検索結果がありません。" });
      }
    }
  } catch (err) {
    console.error(err);
    next();
  }
};

export const createProfile = async (req, res, next) => {
  try {
    const { id } = req.body;
    await User.update(
      {
        sns_id: id,
      },
      { where: { id: req.user.id } }
    );
    return res.status(200).json("成功");
  } catch (err) {
    console.error(err);
    next();
  }
};
