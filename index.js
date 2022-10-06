import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import { registerValidation, loginValidation, postValidation } from "./validations/validations.js";
import { getMe, login, register } from "./controllers/UserController.js";
import { create, getAll, getLastTags, getOne, remove, update } from "./controllers/PostController.js";
import { checkAuth, handleValidationErrors} from "./utils/index.js"

mongoose
  .connect(
    "mongodb+srv://blog-node:blog-node@cluster0.0n7yyia.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage})

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use('/uploads', express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Nodemon");
});

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post("/auth/register", registerValidation, handleValidationErrors, register);

app.get("/posts", getAll);
app.get("/tags", getLastTags);
app.get("/posts/:id", getOne);

app.get("/auth/me", checkAuth, getMe);
app.post("/posts", checkAuth, postValidation, handleValidationErrors, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, postValidation, handleValidationErrors, update);


app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } 

  console.log("Server OK");
});