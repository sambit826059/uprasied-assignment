import express from "express";
import { PrismaClient } from "@prisma/client";
import { randomNameGenerator } from "../utils/randomNameGenerator";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("Gadget server healthy");
});

router.post("/", async (req, res): Promise<any> => {
  const newGadgetName = (await randomNameGenerator()) || "random-gadget";
  try {
    const newGadget = await prisma.gadgets.create({
      data: {
        name: newGadgetName,
      },
    });

    return res.status(201).json({
      id: newGadget.id,
      name: newGadget.name,
      status: newGadget.status,
      createdAt: newGadget.createdAt,
    });
  } catch {
    console.error("Error creating gadget");
    return res.status(500).json({ error: "Failed to create gadget" });
  }
});

export default router;
