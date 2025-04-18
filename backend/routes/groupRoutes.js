import express from "express";
import { createGroup, getUserGroups } from "../controllers/groupController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", protect, createGroup);
router.get("/my-groups", protect, getUserGroups);

export default router;
