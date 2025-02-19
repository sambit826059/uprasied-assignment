import express, { json, Request, Response } from "express";
import { GadgetStatusEnum, PrismaClient } from "@prisma/client";
import { randomNameGenerator } from "../utils/randomNameGenerator";
import { codeGenerator } from "../utils/codeGenerator";

const router = express.Router();
const prisma = new PrismaClient();

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

// POST: Add a new gadget to the inventory
router.post("/", async (req: Request, res: Response): Promise<any> => {
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

// PATCH: Update an existing gadget's information.
router.patch("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const body = await req.body;
    const updatedGadget = await prisma.gadgets.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        status: body.status,
      },
    });

    return res.json({
      id: updatedGadget.id,
      name: updatedGadget.name,
      status: updatedGadget.status,
    });
  } catch (error) {
    console.error("Error updating gadget");
    return res.status(500).json({ error: "Failed to update gadget" });
  }
});

// DELETE: Remove a gadget from the inventory.
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const body = await req.body;
  try {
    const statusUpdate = GadgetStatusEnum.Decomissioned;
    const decomissionedAtTime = new Date();

    const updatedGadget = await prisma.gadgets.update({
      where: {
        id: body.id,
      },
      data: {
        status: statusUpdate,
        decomissionedAt: decomissionedAtTime,
      },
    });

    return res.json({
      id: updatedGadget.id,
      name: updatedGadget.name,
      status: updatedGadget.status,
      message: "Gadget decomissioned",
    });
  } catch (error) {
    console.error("Error decomissioning gadget:", error);

    const findGadget = await prisma.gadgets.findFirst({
      where: {
        id: body.id,
      },
    });
    if (!findGadget) {
      return res.status(404).json({ error: "Gadget not found" });
    }

    return res.status(500).json({ error: "Failed to decomission gadget" });
  }
});

router.post(
  "/:id/self-destruct",
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const existingGadget = await prisma.gadgets.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingGadget) {
        return res
          .status(404)
          .json({ error: "No matching gadget with the given id" });
      }
      // Code verification
      const generateConfirmationCode = codeGenerator();
      const userSubmittedConfirmationCode = generateConfirmationCode;

      if (generateConfirmationCode !== userSubmittedConfirmationCode) {
        return res.status(400).json({
          error: "Confirmation code mismatch",
        });
      }

      const destroyedAtTime = new Date();

      const destoyedGadget = await prisma.gadgets.update({
        where: {
          id: id,
        },
        data: {
          status: GadgetStatusEnum.Destroyed,
          destroyedAt: destroyedAtTime,
        },
      });

      return res.status(200).json({
        message: `Sucessfully destroyed gadget ${id}`,
        id: destoyedGadget.id,
        name: destoyedGadget.name,
        status: destoyedGadget.status,
        confirmationCode: userSubmittedConfirmationCode,
      });
    } catch (error) {
      res.status(500).json({
        message: { error: "Gadget couldn't be destroyed" },
      });
    }
  },
);

export default router;
