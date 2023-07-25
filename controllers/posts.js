import User from "../models/User.js";
import Post from "../models/Post.js";

/* ++++ CREATE POST ++++ */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    console.log(" posts req.body", req.body);
    // await newPost.save();
    const post = await Post.find();
    res.status(201).json(newPost);
  } catch (err) {
    console.log("err.message", err.message);
    res.status(409).json({ message: err.message });
  }
};
/* ---- CREATE POST ---- */

/* ++++ GET POST ++++ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.statust(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/* ---- GET POST ---- */

/* ++++ UPDATE POST ++++ */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    isLiked ? post.likes.delete(userId) : post.likes.set(userId, true);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/* ---- UPDATE POST ---- */
