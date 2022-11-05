import { Router } from 'express';

const router = Router();

const articles: number[] = [1, 2, 3]; 

router.get('/articles/:id?', (req, res) => {
    console.log(req.body.username);
    res.send(articles);
});

router.put('/articles/:id');

router.post('/article', (req, res) => {
    console.log(req);
    console.log(req.body.username);
    res.send(articles);
});

export default router
