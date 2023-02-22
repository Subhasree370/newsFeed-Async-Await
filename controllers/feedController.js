const feedModel = require("../models/feedModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator"); //named export

exports.getPost = async (req, res, next) => {
  let perPage = 2;
  let currentpage = req.query.page || 1;
  try {
    const counts = await feedModel.find().countDocuments();
    const posts = await feedModel
      .find()
      .skip((currentpage - 1) * perPage)
      .limit(perPage);
    res.status(201).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: counts,
    });
  } catch (error) {
    error.statusCode = "500";
    throw error;
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const feed = new feedModel({
    title: title,
    content: content,
    creator: req.userId,
  });
  try {
    await feed.save();
    // .then((result) => {
    const user = await userModel.findById(req.userId);
    // })
    // .then((user) => {
    creator = user;
    user.post.push(feed);
    await user.save();
    // })
    // .then(() => {
    res.status(201).json({
      message: "Post created successfully",
      post: feed,
      creator: {
        _id: creator._id,
        name: creator.name,
      },
    });
    // })
  } catch (error) {
    error.statusCode = "500";
    throw error;
  }
};

exports.getSinglePost = async (req, res, next) => {
  const feedId = req.params.postId;
  try {
    const feed = await feedModel
      .findById(feedId)
      .populate("creator", ["name", "email"]);

    // .then((feed) => {
    if (!feed) {
      const error = new Error("Feed does not exist");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Feeds fetched succesfully",
      feed: feed,
    });
    // })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const feedId = req.params.postId;
  try {
    await feedModel.findByIdAndRemove(feedId);
    // .then(() => {
    return res.status(200).json({
      message: "Feed is deleted succesfully",
    });
    // })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const feedId = req.params.postId;
  try {
    const feed = await feedModel.findById(feedId);
    // .then((feed) => {
    if (!feed) {
      const error = new Error("Feed does not exist");
      error.statusCode = 404;
      return next(error);
    }
    feed.title = title;
    feed.content = content;
    const updatedFeed = await feed.save();
    // })
    // .then((feed) => {
    return res.status(200).json({
      message: "feed are updated succesfully",
      feed: updatedFeed,
    });
    // })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
};
