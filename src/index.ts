import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server healthy");
});

app.use("/*", cors());
app.route("api/v1/");

app.listen(3000);
