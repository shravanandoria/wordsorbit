const express = require("express");
const router = express.Router();
const { Article } = require("../models/articles");
const { User } = require("../models/user");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Create articles
router.post(
  "/createarticle",
  [
    body("title", "Title must be more 5 characters").isLength({ min: 5 }),
    body("body", "Body must be more 20 characters").isLength({ min: 20 }),
  ],
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).send("Please Login to create a post");
      }
      const {
        title,
        body,
        date,
        author = req.user.id,
        image,
        category,
      } = req.body;

      const article = new Article({
        title,
        body,
        author,
        image,
        date,
        category,
      });
      await article.save();
      res.json(author);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

//Fetch all articles
router.get("/", async (req, res) => {
  try {
    const article = await Article.find();
    res.json({ article });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Fetch articles of single user
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userArticles = await Article.find({ author: userId });
    res.json({ userArticles });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//FETCH PARTICULAR CATEGORY LIST
router.post("/categories", async (req, res) => {
  try {
    const { category } = req.body;
    const categories = await Article.find({ category });
    res.json({ categories });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Fetch single article
router.get("/article/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(400).json({ error: "Cannot Find The Article" });
    }
    const author = await User.findById(article.author);
    res.json({ article, author });
  } catch (error) {
    res.status(500).json({ error: "Internal Error" });
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    const articleId = req.params.id;
    const authorId = req.user.id;

    let article = await Article.findById(articleId);
    if (!article) {
      return res
        .status(400)
        .json({ error: "cannot find the article", success: false });
    }

    const author = await Article.find({ _id: articleId, author: authorId });

    if (!author) {
      return res.status(400).json({
        error: "You do not have permission to delete this article",
        success: false,
      });
    }

    const deleteArticle = await Article.findByIdAndDelete(articleId);
    res.json({ deleteArticle, success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// update Article
router.put("/update/:id", fetchUser, async (req, res) => {
  try {
    const articleId = req.params.id;
    const authorId = req.user.id;
    const { title, image, body, category } = req.body;
    const article = await Article.find({ _id: articleId });
    if (!article) {
      return res.status(400).json({ error: "Cannot Find The Article" });
    }

    const author = await Article.find({ _id: articleId, author: authorId });
    if (!author) {
      return res
        .status(400)
        .json({ error: "You have not authorized to edit this article" });
    }

    if (title || body || image || category) {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { title, image, body, category },
        { new: true }
      );
      res.json(updatedArticle);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
