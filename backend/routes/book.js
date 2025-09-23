// routes/book.js
const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const User = require("../models/user");

// Add Book => Seller
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "You are not having access to perform seller work" });
    }
    const book = new Book({
      sellerId: id,
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book is added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Book => Book Owner
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    await Book.findOneAndUpdate(
      { _id: bookid, sellerId: id },
      {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
      }
    );
    return res.status(200).json({ message: "Book is updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Delete Book => Book Owner
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    await Book.findOneAndDelete({ _id: bookid, sellerId: id });
    return res.status(200).json({ message: "Book is deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get My Books (seller only)
router.get("/get-my-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "Only sellers can view their own books" });
    }
    const books = await Book.find({ sellerId: id }).sort({ createdAt: -1 });
    return res.json({ status: "Success", data: books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get All Books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Search Books by title/author — ALL words must match (AND search)
router.get("/search-books", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    // Split query into words, escape regex specials
    const words = q
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    // Build AND of per-word OR(title, author)
    const andConditions = words.map((w) => ({
      $or: [
        { title: { $regex: w, $options: "i" } },
        { author: { $regex: w, $options: "i" } },
      ],
    }));

    const filter = andConditions.length ? { $and: andConditions } : {};

    const items = await Book.find(filter).sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: items,
      total: items.length,
      query: q,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get Recently Added Books
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(5);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get Book BY ID
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;