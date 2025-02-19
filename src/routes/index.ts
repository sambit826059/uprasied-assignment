import express, { Router } from "express";
import gadgetRouter from "./gadgets";

const router: Router = express.Router();

router.use("/gadgets", gadgetRouter);

export default router;
