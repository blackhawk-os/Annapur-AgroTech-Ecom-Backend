
require("dotenv").config();
const app = require("./index");
const connectDB = require("./src/config/db");


const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    app.listen(PORT, () => 
      console.log(`Server running on Port ${PORT}`));
})();
