"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const article_1 = __importDefault(require("./routes/article"));
const profile_1 = __importDefault(require("./routes/profile"));
const following_1 = __importDefault(require("./routes/following"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectionString = "mongodb+srv://Johnson:123@cluster0.td6oylq.mongodb.net/DB?retryWrites=true&w=majority";
const app = (0, express_1.default)();
const corsOption = { origin: "http://localhost:3000", credentials: true };
// Dev Middlewares
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOption));
// MongoDB
// (async () => {
//     const connector = mongoose.connect(connectionString);
//     await (connector.then(async()=> {
//         console.log("successfully");
//     }));
// })
// ! operator tells the compiler to ignore the possibility of it being undefined
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected!!');
    }
    catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
});
connectDB();
const hello = (req, res) => {
    res.send("Hello World");
};
app.get("/", hello);
app.use('/', auth_1.default);
app.use('/', profile_1.default);
app.use('/', article_1.default);
app.use('/', following_1.default);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({message: err.message});
// });
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
// app.listen(3001, () => console.log(123));
