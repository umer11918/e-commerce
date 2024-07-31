const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000 ;
require("./db/config");

const User = require("./db/user");
const Product = require("./db/Product");
const Cart = require("./db/cart"); // Add the Cart model

const app = express();
const jwtKey = "e-com";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (req.originalUrl.includes('add-product')) {
      uploadPath = 'uploads/products/';
    } else if (req.originalUrl.includes('register')) {
      uploadPath = 'uploads/profiles/';
    }
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

// JWT verification middleware
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        console.log('JWT Verification Error:', err); // Log error
        return res.status(401).send({ res: 'Invalid token' });
      } else {
        console.log('Decoded Token:', decoded); // Log decoded token
        
        req.user = decoded.user || decoded.result; // Set the user data in req.user
        console.log("User info in req.user:", req.user);
        next();
      }
    });
  } else {
    return res.status(401).send({ res: 'Token is required' });
  }
}

// Routes
app.post("/login", async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  if (req.body.password && req.body.email) {
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          return res.status(500).send({ result: "Error generating token" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.status(404).send({ result: "No user found" });
    }
  } else {
    res.status(404).send({ result: "No user found" });
  }
});
app.post("/register", upload.single('image'), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    let role = 'user'; // Default role

    if (!existingAdmin) {
      // If no admin exists, assign the 'admin' role to this user
      role = 'admin';
    }

    let user = new User({
      name,
      email,
      password,
      role, // Use the determined role
      image: req.file ? req.file.filename : "" 
    });

    let result = await user.save();
    result = result.toObject();
    delete result.password;

    jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        return res.status(500).send({ result: "Error generating token" });
      }
      res.send({ result, auth: token });
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).send({ result: "Name or email already exists" });
    }
    res.status(500).send({ result: "Server error" });
  }
});


app.post("/add-product", upload.array('images'), verifyToken, async (req, res) => {
  try {
    const files = req.files; // Array of file objects
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
      images: files.map(file => file.filename) // Save filenames of images
    });

    let result = await product.save();
    res.send(result);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ res: "empty" });
  }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;
  let result = await Product.findById(productId);
  if (result) {
    res.send(result);
  } else {
    res.send("no result");
  }
});

app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key, $options: 'i' } },
      { price: { $regex: req.params.key, $options: 'i' } },
      { category: { $regex: req.params.key, $options: 'i' } },
      { company: { $regex: req.params.key, $options: 'i' } },
    ],
  });
  res.send(result);
});

app.post("/add-to-cart", verifyToken, async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity }]
    });
  } else {
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.send(cart);
});

app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log(cart);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ items: [] });
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});