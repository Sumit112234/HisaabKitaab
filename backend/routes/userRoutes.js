
import express from 'express';
import { getUser, getUserGroups, getUsers, searchUsers } from '../controllers/userController.js';



const router = express.Router();



router.route('/').get(getUsers);
router.route('/find').get(searchUsers);
router.route('/:id').get(getUser);
router.route('/me/groups').post(getUserGroups);

export default router;
