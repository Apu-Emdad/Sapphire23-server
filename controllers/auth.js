import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ++++ REGISTER USER ++++ */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picuturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picuturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100000),
      impressions: Math.floor(Math.random() * 100000),
    });
    const savedUser = newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.essage });
  }
};
/* ---- REGISTER USER ---- */
/* ++++ Login ++++ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(400).json({ mag: "Bad request. User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ mag: "Wrong Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.eventNames.JWT_SECRET,
      { expiresIn: "30d" }
    );
    delete user.password;
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.essage });
  }
};

/* ---- Login ---- */
