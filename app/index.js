const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const uploadFolder = "uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.send("Error reading upload folder.");
    files = files.filter(f => f.endsWith(".js"));
    res.render("index", { files });
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

app.get("/snippet/:filename", (req, res) => {
  const filePath = path.join(__dirname, uploadFolder, req.params.filename);
  if (!fs.existsSync(filePath)) return res.send("File not found.");
  const code = fs.readFileSync(filePath, "utf-8");
  res.render("snippet", { code, filename: req.params.filename });
});

app.listen(2227, () => console.log("App running on http://localhost:2227"));
