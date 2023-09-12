const postModel = require("../models/postModel");

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //validate
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();

    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
    console.log(req);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in Create Post APi",
      error,
    });
  }
};

const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Posts fetched successfully.",
      posts,
    });
  } catch (error) {
    return res.status(500).send({
      success: true,
      message: "Error in GET All Post API",
      error,
    });
  }
};

// get user posts
const getUserPostController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    return res.status(200).send({
      success: true,
      message: "User Posts",
      userPosts,
    });
  } catch (error) {
    return res.status(500).send({
      success: true,
      message: "Error in User Post API",
      error,
    });
  }
};

// delete post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    return res.status(200).send({
      success: true,
      message: "Your post has been deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting post api",
      error,
    });
  }
};

// update post
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // find post
    const post = await postModel.findById({ _id: req.params.id });

    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please provide post title or description",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: title || post.title,
        description: description || post.description,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Post updated successfully!",
      updatedPost,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in updating post",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsController,
  getUserPostController,
  deletePostController,
  updatePostController,
};
