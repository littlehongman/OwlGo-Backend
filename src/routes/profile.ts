import { Router } from 'express';
import { getUserHeadline, updateHeadline, getUserEmail, updateEmail, getUserZipcode, updateZipcode, getUserAvatar, updateAvatar, getDateOfBirth } from '../controllers/profile';


const router = Router();


router.get('/headline/:user?', getUserHeadline);

router.put('/headline', updateHeadline);

router.get('/email/:user?', getUserEmail);
router.put('/email', updateEmail)

router.get('/dob/:user?', getDateOfBirth);

router.get('/zipcode/:user?', getUserZipcode) 
router.put('/zipcode', updateZipcode)

router.get('/avatar/:user?', getUserAvatar)
router.put('/avatar', updateAvatar)


export default router
