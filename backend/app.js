const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Order = require("./routes/order");
const Cart = require("./routes/cart");


app.use(express.json());
app.use(cors({
    origin:'*',
    credentials:false
}));


// Routes
app.use("/api/v1",User);
app.use("/api/v1",Books);
app.use("/api/v1",Favourite);
app.use("/api/v1",Cart);
app.use("/api/v1",Order);

// Add a basic route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Creating Port
app.listen(process.env.PORT, () => {
    console.log(`Server Started at port ${process.env.PORT}`);
});
