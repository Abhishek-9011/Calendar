import express from "express";
import {
  addEvent,
  deleteEvent,
  updateEvent,
} from "../controllers/event.controller";
import { userMiddleware } from "../middleware/userMiddelware";
const router = express.Router();

router.post("/event", userMiddleware, addEvent);
router.put("/event/:eventId", userMiddleware, updateEvent);
router.delete("/event/:eventId", userMiddleware, deleteEvent);
export default router;