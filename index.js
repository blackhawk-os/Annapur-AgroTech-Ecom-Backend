require('dotenv').config(); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const Product = require("./src/models/product");
const User = require("./src/models/user");


// Middlewares
app.use(express.json());
app.use(cors());


// API Creation
app.get("/", (req, res) => {
  res.send("Welcome to Annapur Backend!");
});

//Image Upload setup
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file, cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

// Multer in-memory storage
const upload = multer({ storage:storage });

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'));
app.post("/upload", upload.single('product'),(req, res)=>{

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
        success:1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api", require("./src/routes/productRoutes"));
app.use("/api", require("./src/routes/userRoutes"));
app.use("/api", require("./src/routes/cartRoutes"));
app.use("/api", require("./src/routes/orderRoutes"));


module.exports = app;
