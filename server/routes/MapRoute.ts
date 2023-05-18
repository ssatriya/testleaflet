import express from "express";
import { createMap, getMap } from "../controller/MapController";

const router = express.Router();

router.get("/", getMap);
router.post("/map", createMap);

export default router;
