import { Router } from 'express';
import multer from 'multer';
import { getUserHeadline, updateHeadline, getUserEmail, updateEmail, getUserZipcode, updateZipcode, getUserAvatar, updateAvatar, getDateOfBirth, getProfile, updatePhone, getAccount, unlinkGoogle } from '../controllers/profile';


const router = Router();
const upload = multer();


router.get('/headline/:user?', getUserHeadline);
router.put('/headline', updateHeadline);

router.get('/email/:user?', getUserEmail);
router.put('/email', updateEmail)

router.get('/dob/:user?', getDateOfBirth);

router.get('/zipcode/:user?', getUserZipcode) 
router.put('/zipcode', updateZipcode)

router.get('/avatar/:user?', getUserAvatar)
router.put('/avatar', upload.single('image'), updateAvatar)

router.get('/profile', getProfile)

router.put('/phone', updatePhone);

router.get('/account', getAccount);
router.put('/google/unlink', unlinkGoogle);
// router.put('/profile', updateProfile)


export default router
