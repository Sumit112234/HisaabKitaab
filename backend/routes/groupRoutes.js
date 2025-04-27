import express from "express";
import { getUser, getUserGroups, getUsers } from "../controllers/userController.js";
import { acceptInvitation, addMembers, createGroup, deleteGroup, getGroup, getGroups, leaveGroup } from "../controllers/groupController.js";
// import { createGroup, getUserGroups } from "../controllers/groupController.js";
// import getUser
// import protect from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/create", protect, createGroup);
// router.get("/my-groups", protect, getUserGroups);
// router.use('/:groupId/expenses', expenseRouter);

router
  .route('/')
  .get(getGroups)
  .post(createGroup);

router
  .route('/:id')
  .get(getGroup)
  

router.route('/:id/members').put(addMembers);
router.route('/:id/members/:userId').delete(leaveGroup);
router.route('/:id').delete(deleteGroup);
// router.route('/:groupId/settlements').get(acceptInvitation);
router.route('/:groupId/settlements').get(acceptInvitation);


export default router;
