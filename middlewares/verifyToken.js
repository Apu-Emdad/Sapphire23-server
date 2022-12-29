import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
          res.status(401).json("Invalid Token");
        }
        req.user = user;
        next();
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Unallowed authorization process");
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Unallowed authorization process");
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
