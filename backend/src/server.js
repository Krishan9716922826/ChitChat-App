require("dotenv").config();
const express = require("express");

const authRoute = require("./routes/auth.route");
const connectToDb = require("./db/db");
connectToDb();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("This is home Page");
});
app.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
