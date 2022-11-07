import { Router } from 'express';
import { getUserHeadline, updateHeadline } from '../controllers/profile';


const router = Router();


router.get('/headline/:user?', getUserHeadline);

router.put('/headline', updateHeadline);

router.get('/email/:user?');
router.put('/email')

router.get('/dob/:user?');

router.get('/zipcode/:user?')
router.put('/zipcode')

router.get('/avatar/:user?')
router.put('/avatar')

router.put('/password')

export default router
