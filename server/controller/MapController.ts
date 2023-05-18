import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const wellknown = require("wellknown");

const prisma = new PrismaClient();

export const getMap = async (req: Request, res: Response) => {
  try {
    const response: any =
      await prisma.$queryRaw`SELECT ST_AsGeoJSON(shape) as geojson FROM map WHERE id = 3`;
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createMap = async (req: Request, res: Response) => {
  const { kab, latlng, shape } = req.body;

  try {
    const wkt = wellknown.stringify(shape);

    await prisma.$queryRaw`INSERT INTO map (kab_name, lat_lng, shape) VALUES (${kab}, ${latlng}, ST_GeomFromText(${wkt}))`;

    res.status(201).json({ message: "Success" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
