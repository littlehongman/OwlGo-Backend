import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import articleRoute from './routes/article'
import profileRoute from './routes/profile'
import auth from './middlewares/auth'
import mongoose, { ConnectOptions } from "mongoose"
import { User } from './models/User';

const connectionString: string = "mongodb+srv://Johnson:123@cluster0.td6oylq.mongodb.net/DB?retryWrites=true&w=majority"

const app: Application = express();
const corsOption = {origin:"http://localhost:3000", credentials: true};

// Dev Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOption));

// MongoDB
// (async () => {
//     const connector = mongoose.connect(connectionString);
//     await (connector.then(async()=> {
//         console.log("successfully");
//     }));
// })
const connectDB = async () => {
    try {
      await mongoose.connect(connectionString,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
  
      console.log('MongoDB connected!!')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
  }

connectDB()


const hello = async(req: Request, res: Response) => {
    const newUser = await (new User({ 
        username: '123',
        salt: "1",
        hash: "1"
    }).save());

    const user = await User.findOne({ username: '123' });

    
    res.send({username: newUser.username});
    //res.send('Hello');
}

app.get("/", hello);
app.use('/', auth);

app.use('/', profileRoute)
app.use('/', articleRoute);


// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({message: err.message});
// });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    const addr: any = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`);
})


// app.listen(3001, () => console.log(123));