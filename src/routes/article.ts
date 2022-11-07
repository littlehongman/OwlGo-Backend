import { Router } from 'express';
import { createPost, getPosts } from '../controllers/article'

const router = Router();


router.get('/articles/:id?', getPosts);

router.put('/articles/:id');

router.post('/article', createPost);

export default router
