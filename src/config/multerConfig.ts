import multer from "multer";
import { logger } from "./logger";
import { json } from "sequelize";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueSuffix = Date.now() + "- AOWKOKAWOKAOWKA -";
    const extension = file.originalname.split(".").pop(); // Get the file extension
    const filename = file.fieldname + "-" + uniqueSuffix + "." + extension; // Include extension in the filename
    const path = "uploads/" + filename; // Create the full path including the 'uploads/' directory
    cb(null, path);

    logger.info(
      json({
        uniqueSuffix: uniqueSuffix,
        extension: extension,
        filename: filename,
        path: path,
      })
    ); // log
  },
});

export const upload = multer({ storage });
