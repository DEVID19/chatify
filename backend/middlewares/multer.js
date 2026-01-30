import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cd) => {
    cb(null, file.organization);
  },
});

export const upload = multer({ storage });
