import { Router } from 'express';
import { getFollowing, addFollowing, deleteFollowing, getFriends, deleteFriend, addFriend  } from '../controllers/following';

const router = Router();


router.get('/following/:user?', getFollowing);
router.put('/following/:user', addFollowing);
router.delete('/following/:user', deleteFollowing);


router.get('/friends', getFriends)
router.put('/friends/:user', addFriend)
router.delete('/friends/:user', deleteFriend)

export default router
