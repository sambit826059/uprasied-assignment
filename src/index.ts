import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import gadgetRouter from "./routes";

dotenv.config();
const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server healthy");
});

app.use("/api/v1/", gadgetRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
