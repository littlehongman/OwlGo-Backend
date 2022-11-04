import { Router } from 'express';

const router = Router();

const articles: number[] = [1, 2, 3]; 

router.get('/articles/:id?', (req, res) => {
    res.send(articles);
});

router.put('/articles/:id');

router.post('/article');

export default router
