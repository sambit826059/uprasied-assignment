import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomNameGenerator } from "../utils/randomNameGenerator";

const router = express.Router();
const prisma = new PrismaClient();

interface GadgetName {
  name: string;
}

interface ResponseData {
  namesWithChances: string[];
}

router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const gadgetNames = await prisma.gadgets.findMany({
      select: {
        name: true,
      },
    });

    const namesWithChances: string[] = gadgetNames.map(({ name }) => {
      const capitalizedName = name[0].toUpperCase() + name.slice(1);
      const percentage = Math.floor(Math.random() * 100);

      return (
        "The " + capitalizedName + " - " + percentage + "% success probability"
      );
    });

    return res.status(200).json({
      namesWithChances,
    });
  } catch {
    console.error("Error getting the gadget names");
    res
      .status(500)
      .json({ error: "Failed to get the gadget names from the databse" });
  }
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
