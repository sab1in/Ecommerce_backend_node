const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const app = express();

//config dotenv to use (.env)
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("successfull");
}).catch((err)=>{
    console.log("error aako xa ta")
    console.log(err)
})

// to make that api accept json
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

//listening to the server
app.listen(process.env.PORT || 5000, ()=>{
    console.log("backend server is running");
})