import { Router } from 'express';
import { createPost, getPosts, updatePost } from '../controllers/article'

const router = Router();


router.get('/articles/:id?', getPosts);

router.put('/articles/:id', updatePost);

router.post('/article', createPost);

export default router
