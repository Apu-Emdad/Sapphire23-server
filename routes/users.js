import express from "express";
import {
  getUsers,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUsers);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
