const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

// Place Order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();
      await User.findByIdAndUpdate(id, { $push: { orders: orderDataFromDb._id } });
      await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
    }

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

// Get Order History From Particular User
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const ordersData = userData.orders.reverse();

    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

// Get All Orders => Seller
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (user?.role === "seller") {
      const rows = await Order.find()
        .populate({ path: "book", select: "-__v -createdAt -updatedAt" })
        .populate({ path: "user", select: "username email address avatar" }) 
        .sort({ createdAt: -1 });

      const mine = rows.filter(
        (r) => r.book && String(r.book.sellerId) === String(id)
      );

      return res.json({ status: "Success", data: mine });
    }

    // Admin
    const all = await Order.find()
      .populate({ path: "book" })
      .populate({ path: "user", select: "username email address avatar" }) 
      .sort({ createdAt: -1 });

    return res.json({ status: "Success", data: all });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

// Update Order Status => Admin
router.put("/update-order-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "Success",
      message: "Order Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

module.exports = router;
