const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*"
}));


// ================= RAZORPAY =================
const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

});


// ================= CREATE ORDER =================
app.post("/create-order", async (req, res) => {

  try {

    const order = await razorpay.orders.create({

      amount: 200000, // ₹2000 advance

      currency: "INR",

      receipt: "receipt_" + Date.now()

    });

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Order creation failed"
    });

  }

});


// ================= VERIFY PAYMENT =================
app.post("/verify-payment", (req, res) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature

    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      res.json({
        success: true
      });

    } else {

      res.status(400).json({
        success: false
      });

    }

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }

});


// ================= HOME ROUTE =================
app.get("/", (req, res) => {

  res.send("Backend Running Successfully");

});


// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("Server Running on Port " + PORT);

});
