const express = require('express');
const Product = require('../db/Product');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // Create this middleware

router.post("/add-product", upload.array('images'), verifyToken, async (req, res) => {
  try {
    const files = req.files;
    const { name, price, category, company, userId } = req.body;
    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }
    let product = new Product({
      name,
      price,
      category,
      company,
      userId,
      images: files.map(file => file.filename)
    });
    let result = await product.save();
    res.send(result);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ res: "empty" });
  }
});

router.delete("/product/:id", verifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

router.get("/product/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;
  let result = await Product.findById(productId);
  if (result) {
    res.send(result);
  } else {
    res.send("no result");
  }
});

router.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

router.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

module.exports = router;
