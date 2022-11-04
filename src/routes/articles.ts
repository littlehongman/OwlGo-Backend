import { Router } from 'express';

const router = Router();

const articles: number[] = [1, 2, 3]; 

router.get('/articles', (req, res) => {
    res.send(articles);
});

router.put('/articles');

router.post('/article');

export default router
