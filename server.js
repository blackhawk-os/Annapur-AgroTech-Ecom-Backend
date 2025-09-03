
require("dotenv").config();
const app = require("./index");
const connectDB = require("./src/config/db");


const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();


    // const listEndpoints = require("express-list-endpoints");
    // console.log(listEndpoints(app));
    app.get("/test-route", (req, res) => res.send("Test route works"));
    app.listen(PORT, () => 


      console.log(`Server running on Port ${PORT}`));
})();

