const jwt = require("jsonwebtoken");
const JWT_SECRET = "MyTopSecretHere";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-header");
  if (!token) {
    return res
      .status(400)
      .json({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Authentication Error");
  }
};

module.exports = fetchUser;
