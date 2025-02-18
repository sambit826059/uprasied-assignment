import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gadgetRouter from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server healthy");
});

app.use("/api/v1/", gadgetRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
