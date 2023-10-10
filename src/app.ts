import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import articleRoute from './routes/article'
import profileRoute from './routes/profile'
import followingRoute from './routes/following'

import auth from './middlewares/auth'
//import passportAuth from './middlewares/passport';

import mongoose, { ConnectOptions } from "mongoose"

import session from 'express-session'
import cookieSession from 'cookie-session';
import passport from 'passport'

// Third-party config
import "./config/cloudinary";
import "./config/passport";

import 'dotenv/config'
import { BASE_URL, COOKIE_KEY } from './utils/secrets';

const app: Application = express();
const corsOption = {origin:BASE_URL, credentials: true};

// Dev Middlewares
app.use(express.json())
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOption));
//app.enable("trust proxy");



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
// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [COOKIE_KEY],
//     secure: true,
//     sameSite: "none",
//   })
// );

// app.use(
//   session({
//     secret: "secretcode",
//     resave: true,
//     saveUninitialized: true,
//     // cookie: {
//     //   // sameSite: "none",
//     //   // secure: true,

//     //   //domain: "myapp.vercel.app"
//     //   //httpOnly: true
//     //   maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
//     // }
// }))

// app.use(expressSession({
//   secret: COOKIE_KEY,
//   resave: true,
//   saveUninitialized: true
// }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());



const hello = (req: Request, res: Response) => {
    res.send("Hello World!");
}



app.get('/', hello);
//app.use('/', passportAuth);
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