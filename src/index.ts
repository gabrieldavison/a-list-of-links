import express from "express";
import dotenv from "dotenv";
import https from "https";
import { promises as fs } from "fs";
import path from "path";
import mustache from "mustache";
dotenv.config();

const publicBookmarkTag = process.env.PUBLIC_TAG
const dataPath = path.join(__dirname, "../", "data", "data.json");
const templatePath = path.join(__dirname, "../", "templates", "index.html");

const app = express();
app.use("/static", express.static(path.join(__dirname, "../", "public")));
const PORT = 8000;
updateData()

app.get("/", async (req, res) => {
  
  const jsonData = await fs.readFile(dataPath, "utf8");
  const linkData = await JSON.parse(jsonData);

  const template = await fs.readFile(templatePath, "utf8");

  const page = req.query.page ? Number(req.query.page) : 1;
  const offset = page * 10 - 10;

  const view = {
    links: linkData.slice(offset, offset + 10),
    next: () => getNext(),
    prev: () => getPrev(),
  };

  function getNext() {
    if (offset + 10 >= linkData.length) {
      return null;
    } else {
      return page + 1;
    }
  }
  function getPrev() {
    if (page === 0) {
      return null;
    } else {
      return page - 1;
    }
  }
  res.send(mustache.render(template, view));
});

app.get("/update", updateData);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

function updateData() {
  const reqURL = `https://api.pinboard.in/v1/posts/all?format=json&tag=${publicBookmarkTag}&auth_token=${process.env.PINBOARD_TOKEN}`;
  https
    .get(reqURL, (resp) => {
      let body = "";
      resp.on("data", (chunk) => {
        body += chunk;
      });
      resp.on("end", () => {
        try {
          fs.writeFile(dataPath, body);
        } catch (e) {
          console.log(e);
        }
      });
    })
}
