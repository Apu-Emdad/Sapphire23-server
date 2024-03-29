import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet, { crossOriginResourcePolicy } from "helmet";
import morgan from "morgan";
/* ++++ Node JS Import ++++ */
import path from "path";
import { fileURLToPath } from "url";
/* ---- Node JS Import ---- */
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

import { verifyToken } from "./middlewares/verifyToken.js";
import { createPost } from "./controllers/posts.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* ++++ Configuration ++++ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
/* ---- Configuration ---- */

/* ++++ Multer File Storage (https://github.com/expressjs/multer#diskstorage) ++++ */
export let fileName;
export const setFileName = (newFileName) => {
  fileName = newFileName;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    const fileNameExtension = file.originalname.split(".").pop();
    fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}.${fileNameExtension}`;
    console.log("fileName:", fileName);
    cb(null, fileName);
  },
});
const upload = multer({ storage });
/* ---- Multer File Storage ---- */

/* ++++ ROUTES WITH FILES ++++ */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
/* ---- ROUTES WITH FILES ---- */

/* ++++ ROUTES ++++ */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.get("/", (req, res) => {
  res.send("Hello world");
});

/* --- ROUTES ---- */

/* ++++ Mongoose ++++ */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    /* User.insertMany(users);
    Post.insertMany(posts); */
  })
  .catch((error) => console.log(`${error}. Did not connect`));
/* ---- Mongoose ---- */
