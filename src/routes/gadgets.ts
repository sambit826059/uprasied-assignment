import express, { Request, Response, Router } from "express";
import { GadgetStatusEnum, PrismaClient } from "@prisma/client";
import { randomNameGenerator } from "../utils/randomNameGenerator";
import { codeGenerator } from "../utils/codeGenerator";

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Get a list of gadgets with success probabilities
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Decommissioned, Destroyed]
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: A list of gadget names with success probabilities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 namesWithChances:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid filter value
 *       500:
 *         description: Couldn't execute the request
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const statusFromQuery = req.query.status as string | undefined;
    let statusFilter: GadgetStatusEnum | undefined = undefined;

    if (statusFromQuery) {
      if (
        Object.values(GadgetStatusEnum).includes(
          statusFromQuery as GadgetStatusEnum,
        )
      ) {
        statusFilter = statusFromQuery as GadgetStatusEnum;
      } else {
        return res.status(400).json({ error: "Invalid filter value" });
      }
    }

    const gadgets = await prisma.gadgets.findMany({
      where: { status: statusFilter },
      select: { name: true },
    });

    const namesWithChances: string[] = gadgets.map(
      ({ name }: { name: string }) => {
        const capitalizedName = name[0].toUpperCase() + name.slice(1);
        const percentage = Math.floor(Math.random() * 100);
        return (
          "The " +
          capitalizedName +
          " - " +
          percentage +
          "% success probability"
        );
      },
    );

    return res.status(200).json({ namesWithChances });
  } catch (error) {
    console.error("Error fetching the gadgets: ", error);
    return res.status(500).json({ error: "Couldn't execute the request" });
  }
});

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Add a new gadget to the inventory
 *     responses:
 *       201:
 *         description: Gadget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Failed to create gadget
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const newGadgetName = randomNameGenerator() || "random-gadget";
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

/**
 * @swagger
 * /gadgets:
 *   patch:
 *     summary: Update an existing gadget's information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The gadget ID
 *               name:
 *                 type: string
 *                 description: The new name for the gadget
 *               status:
 *                 type: string
 *                 enum: [Available, Decommissioned, UnderMaintenance]
 *                 description: The new status for the gadget
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       500:
 *         description: Failed to update gadget
 */

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

/**
 * @swagger
 * /gadgets:
 *   delete:
 *     summary: Remove a gadget from the inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the gadget to decommission
 *     responses:
 *       200:
 *         description: Gadget decommissioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Failed to decommission gadget
 */

router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const body = await req.body;
  try {
    const statusUpdate = GadgetStatusEnum.Decommissioned;
    const decommissionedAtTime = new Date();

    const updatedGadget = await prisma.gadgets.update({
      where: {
        id: body.id,
      },
      data: {
        status: statusUpdate,
        decommissionedAt: decommissionedAtTime,
      },
    });

    return res.json({
      id: updatedGadget.id,
      name: updatedGadget.name,
      status: updatedGadget.status,
      message: "Gadget decommissioned",
    });
  } catch (error) {
    console.error("Error decommissioning gadget:", error);

    const findGadget = await prisma.gadgets.findFirst({
      where: {
        id: body.id,
      },
    });
    if (!findGadget) {
      return res.status(404).json({ error: "Gadget not found" });
    }

    return res.status(500).json({ error: "Failed to decommission gadget" });
  }
});

export default router;
