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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const article_1 = __importDefault(require("./routes/article"));
const profile_1 = __importDefault(require("./routes/profile"));
const following_1 = __importDefault(require("./routes/following"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const passport_1 = __importDefault(require("./middlewares/passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_2 = __importDefault(require("passport"));
// Third-party config
require("./config/cloudinary");
require("./config/passport");
require("dotenv/config");
const secrets_1 = require("./utils/secrets");
const app = (0, express_1.default)();
const corsOption = { origin: "https://owlgo-final.surge.sh/", credentials: true };
// Dev Middlewares
app.use(express_1.default.json());
//app.use(bodyParser.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOption));
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
// Set up cookieSession
app.use((0, cookie_session_1.default)({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [secrets_1.COOKIE_KEY],
}));
// app.use(expressSession({
//   secret: COOKIE_KEY,
//   resave: true,
//   saveUninitialized: true
// }));
// initialize passport
app.use(passport_2.default.initialize());
app.use(passport_2.default.session());
const hello = (req, res) => {
    res.send("Hello World");
};
app.get('/', hello);
app.use('/', passport_1.default);
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
