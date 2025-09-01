const Product = require("../models/product");

//Products
exports.getAllProducts = async (req, res ) =>{
     try {
        const products = await Product.find({});
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
exports.addProduct = async(req,res)=>{
    try {
        const products = await Product.find({});
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        
        const product = new Product({
            id: id,
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            short_description: req.body.short_description,
            description: req.body.description,
            category: req.body.category,
        });
        
        await product.save();
        res.json({
            success: true,
            message: "Product added successfully",
            name: product.name
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

//Creating API for deleting products
exports.removeProduct = async(req, res)=>{
    try{
       const product = await Product.findOneAndDelete({id:req.body.id});
         
       if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
       }
       
       res.json({
        success:true,
        message: "Product removed successfully",
        name: product
    });
   } catch (error){
    res.status(500).json({
        success: false,
        error: error.message});
   }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { id: req.body.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            message: "Product updated successfully",
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};