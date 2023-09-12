const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

// router object
const router = express.Router();

//  CREATE POST || POST
router.post("/create-post", requireSignIn, createPostController);

//  GET ALL POST || GET
router.get("/get-all-posts", getAllPostsController);

//  GET USER POST || GET
router.get("/get-user-post", requireSignIn, getUserPostController);

// DELETE POST || DELETE
router.delete("/delete-post/:id", requireSignIn, deletePostController);

// UPDATE POST || PUT
router.put("/update-post/:id", requireSignIn, updatePostController);

// export
module.exports = router;
