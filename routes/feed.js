const express = require("express");
const {
  getPost,
  createPost,
  getSinglePost,
  deletePost,
  updatePost,
} = require("../controllers/feedController");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator"); //named export

const router = express.Router();

router.get("/posts", getPost);
router.post(
  "/posts",
  isAuth,
  [
    body("title", "Please enter title").trim().isLength({ min: 5 }),
    body("content", "Please enter content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/posts/:postId", getSinglePost);
router.put(
  "/posts/:postId",
  isAuth,
  [
    body("title", "Please enter title").trim().isLength({ min: 5 }),
    body("content", "Please enter content").trim().isLength({ min: 5 }),
  ],
  updatePost
);
router.delete("/posts/:postId", isAuth, deletePost);

module.exports = router;
