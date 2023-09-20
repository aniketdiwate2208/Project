// pdfDetailsModel.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  pdfData: Buffer,
});

const File = mongoose.model("File", fileSchema);

const pdfDetailsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, // Reference to the user who uploaded the PDF
  userName: String, // User's name
  pdfName: String, // Name of the uploaded PDF
  numPages: Number, // Number of pages in the PDF
});

const PDFDetails = mongoose.model("PDFDetails", pdfDetailsSchema);

export { PDFDetails, File };
