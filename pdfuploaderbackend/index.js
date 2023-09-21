import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { PDFDetails, File } from "./pdfDetailsModel.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where uploaded files should be stored on your server
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    // Define how uploaded files should be named
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose.connect(
  "mongodb://localhost:27017/LoginRegisterDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  pdfData: Buffer, // Add a field to store PDF binary data
});

// Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now" });
        }
      });
    }
  });
});

// Add a new route for file uploads
app.post("/upload", upload.single("pdf"), async (req, res) => {
  const { email } = req.body;
  const { originalname, buffer, mimetype } = req.file;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const pdfFile = new File({
        filename: originalname,
        contentType: mimetype,
        pdfData: buffer,
      });

      // Calculate the number of pages in the PDF (you may need an external library for this)
      const numPages = calculateNumberOfPages(filename); // Replace with actual logic

      // Save PDF details to the new MongoDB collection
      const pdfDetails = new PDFDetails({
        userId: user._id,
        userName: user.name,
        pdfName: originalname,
        numPages: numPages,
      });

      await pdfFile.save();
      await pdfDetails.save();

      res.json({ message: "PDF details saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving PDF details", error: error.message });
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
