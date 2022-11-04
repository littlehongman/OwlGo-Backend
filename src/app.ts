import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import articleRoute from './routes/articles'
import auth from './middlewares/auth'


const app: Application = express();
app.use(bodyParser.json());
app.use(cookieParser());

const hello = (req: Request, res: Response) => {
    res.send('Hello');
}

app.get("/", hello);

app.use('/', auth)
app.use('/', articleRoute);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({message: err.message});
// });



const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    const addr: any = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`);
})


app.listen(3001, () => console.log(123));