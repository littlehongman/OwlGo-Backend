import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import articleRoute from './routes/article'
import profileRoute from './routes/profile'
import followingRoute from './routes/following'

import auth from './middlewares/auth'
import passportAuth from './middlewares/passport';

import mongoose, { ConnectOptions } from "mongoose"

import session from 'express-session'
import cookieSession from 'cookie-session';
import passport from 'passport'

// Third-party config
import "./config/cloudinary";
import "./config/passport";

import 'dotenv/config'
import { COOKIE_KEY } from './utils/secrets';

const app: Application = express();
const corsOption = {origin:"http://localhost:3000", credentials: true};

// Dev Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json())


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI!,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
  
      console.log('MongoDB connected!!')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
}

connectDB()

// Set up cookieSession
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
  })
);

// app.use(expressSession({
//   secret: COOKIE_KEY,
//   resave: true,
//   saveUninitialized: true
// }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());



const hello = (req: Request, res: Response) => {
    res.send("Hello World");
}



app.get('/', hello);
app.use('/', passportAuth);
app.use('/', auth);


app.use('/', profileRoute);
app.use('/', articleRoute);
app.use('/', followingRoute);


// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({message: err.message});
// });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    const addr: any = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`);
})


// app.listen(3001, () => console.log(123));