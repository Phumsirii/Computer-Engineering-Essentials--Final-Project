import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach((file) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, "app"));
files.map((file) => {
  const route = file
    .replace(__dirname, "")
    .replace("/index.html", "")
    .replace("/app", "");

  app.get(route.replace("[id]", ":id"), (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "app",
        route.replace(req.params.id, "[id]"),
        "index.html"
      )
    );
  });
});

const PORT = 3221;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend Server ready at http://localhost:${PORT}`);
});
