import express, { Application, Request, Response, NextFunction } from 'express';
import articleRoute from './routes/articles'


const app: Application = express()

const hello = (req: Request, res: Response) => {
    res.send('Hello');
}

app.get("/", hello);

app.use('/', articleRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(3001, () => console.log(123));