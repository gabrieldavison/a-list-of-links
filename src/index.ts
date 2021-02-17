import express from "express";
import dotenv from "dotenv";
import https from "https";
import { promises as fs } from "fs";
import path from "path";

dotenv.config();
const app = express();
const PORT = 8000;

app.get("/", async (req, res) => {
  const filePath = path.join(__dirname, "data", "data.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  const linkData = await JSON.parse(jsonData);
  console.log(linkData);
});

app.get("/update", (req, res) => {
  const reqURL = `https://api.pinboard.in/v1/posts/all?format=json&tag=shareList&auth_token=${process.env.PINBOARD_TOKEN}`;
  https
    .get(reqURL, (resp) => {
      let body = "";
      resp.on("data", (chunk) => {
        body += chunk;
      });
      resp.on("end", () => {
        try {
          const filePath = path.join(__dirname, "data", "data.json");
          fs.writeFile(filePath, body);
        } catch (e) {
          console.log(e);
        }
      });
    })
    .on("error", (err) => {
      res.send("Error: " + err.message);
    });
});

app.listen(PORT, () => {
  console.log(process.env.PINBOARD_TOKEN);
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
