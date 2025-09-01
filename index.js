require('dotenv').config(); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");


// Middlewares
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// API Creation
app.get("/", (req, res) => {
  res.send("Welcome to Annapur Backend!");
});


const fs = require("fs");
const { string } = require("zod");
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
app.use('/images',express.static('upload/images'))
app.post("/upload", upload.single('product'),(req, res)=>{
      console.log("File:", req.file);
      console.log("Body:", req.body);

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
        success:1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product",{
    id:{type: Number, required: true,},
    name:{type: String, required: true,},
    image:{type: String, required: true,},
    price:{type: Number, required: true,},
    short_description:{type: String, required: true,},
    description:{type: String, required: false,},
    category:{type:String, required:true,},
    });

app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        price:req.body.price,
        image:req.body.image,
        short_description: req.body.short_description,
        description: req.body.description,
        category:req.body.category,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name: req.body.name,
    });
});

//Creating API for deleting products
app.post('/removeproduct', async(req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    });

});

//Creating API for getting all products
app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    console.log("All Products have been fetched");
    res.send(products);
});


// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

module.exports = app;
