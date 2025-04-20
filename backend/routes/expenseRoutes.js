import express from "express";
// import { addExpense, getGroupExpenses } from "../controllers/expenseController.js";
import protect from "../middleware/authMiddleware.js";
import { createExpense, getExpense, getExpenses, settleExpense, verifyExpense } from "../controllers/expenseController.js";
const router = express.Router();

// router.post("/add", protect, addExpense);
// router.get("/:groupId", protect, getGroupExpenses);

router
  .route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id').get(getExpense);
router.route('/:id/verify').put(verifyExpense);
router.route('/:id/settle').put(settleExpense);

export default router;
