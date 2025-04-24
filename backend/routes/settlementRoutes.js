
import express from 'express';
import { getGroupSettlements } from '../controllers/settlementController.js';
// import { getUser, getUserGroups, getUsers, searchUsers } from '../controllers/userController.js';



const router = express.Router();




router.route('/get-settlements/:groupId').get(getGroupSettlements);
// router.route('/find').get(searchUsers);
// router.route('/:id').get(getUser);
// router.route('/me/groups').post(getUserGroups);

export default router;
