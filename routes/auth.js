const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const fetchUser = require("../middleware/fetchuser");
const { after } = require("lodash");
const JWT_SECRET = "MyTopSecretHere";
var fetchuser = require("../middleware/fetchuser");

//CREATE USER PROFILE
router.post(
  "/signup",
  [
    body("fname", "Enter a valid First Name").isLength({ min: 3 }),
    body("lname", "Enter a valid Last Name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, fname, lname, image, bio } = req.body;

      let user_Email = await User.findOne({ email });
      let user_username = await User.findOne({ username });

      if (user_Email || user_username) {
        return res.status(400).send("Email or Username already taken");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
        fname,
        lname,
        image,
        bio,
      });

      const user = await newUser.save();

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json(authToken);
    } catch (error) {
      res.status(500).send("Something Went Wrong");
    }
  }
);

//LOGIN USER
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password length should be minimum 3").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });

      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Email Or Password Is Incorrect" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Email Or Password Is Incorrect" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.json("Internal Server Error");
    }
  }
);

//UPDATE USER PROFILE
router.post(
  "/update",
  fetchUser,
  [
    body("fname", "First name must be greater than 3").isLength({ min: 3 }),
    body("lname", "Last name must be greater than 3").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be greater than 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { fname, lname, email, password, image } = req.body;

    if (fname || lname || email || password || image) {
      const updateProfile = await User.findByIdAndUpdate(
        req.user.id,
        { fname, lname, email, password, image },
        { new: true }
      );

      res.json({ updateProfile });
    }
  }
);

//GET USER INFORMATION
router.get("/getuser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.json({ user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Follow Functionality
router.post("/follow", fetchUser, async (req, res) => {
  try {
    let isFollowing;
    //Id of user to increase follower
    const { userId } = req.body;
    //Id of LoggedIn user to follow
    let follower;
    let following;

    const checkFollower = await User.findOne({
      _id: userId,
      followers: req.user.id,
    });

    if (checkFollower) {
      //If logged user already followed then unfollow
      isFollowing = true;

      //Decreasing the follower
      follower = await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: req.user.id } },
        { new: true }
      );
      //Decreasing the following
      following = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { following: userId } },
        { new: true }
      );
      return res.json({ follower, following, isFollowing });
    }

    //Increasing the follower
    follower = await User.findByIdAndUpdate(
      userId,
      { $push: { followers: req.user.id } },
      { new: true }
    );

    //Increasing the following
    following = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { following: userId } },
      { new: true }
    );

    isFollowing = false;

    res.json({
      isFollowing,
      follower,
      following,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Fetch logged user followings
router.post("/loggedFollowings", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.body;
  const user = await User.findOne({ _id: userId, following: id });

  if (user) {
    return res.json("unfollow");
  }
  res.json("Follow");
});

//Get individual user
router.get("/fetchuserinfo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Get logged in user
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
