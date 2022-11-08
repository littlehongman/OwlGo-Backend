import { Router } from 'express';
import { getFriends, addFriend, deleteFriend  } from '../controllers/following';

const router = Router();


router.get('/following/:user?', getFriends);

router.put('/following/:user', addFriend);

router.delete('/following/:user', deleteFriend);

export default router
