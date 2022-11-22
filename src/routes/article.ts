import { Router } from 'express';
import multer from 'multer';
import { createPost, getPosts, updatePost } from '../controllers/article'

const router = Router();
const upload = multer();


router.get('/articles/:id?', getPosts);

router.put('/articles/:id', updatePost);

router.post('/article', upload.single('image'), createPost);

export default router
