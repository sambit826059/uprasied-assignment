import express from "express";
import gadgetRouter from "./gadgets";

const router = express.Router();

router.use("/gadgets", gadgetRouter);

export default router;
