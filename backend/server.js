import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/ping", (req, res) => {
  res.send("pong");
});

//Connect DB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected!");
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
  })
}) 
.catch((err) => {
    console.error("MongoDB connection error:", err);
})

