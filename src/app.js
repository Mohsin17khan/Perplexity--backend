import express from 'express'
import dotenv from 'dotenv'
import authRouter from '../src/routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import cors from 'cors'


const app = express();
dotenv.config();

app.use(cors({
    origin:"https://perplexity-ai-frontend-cugn.vercel.app",
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"]
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended :true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use('/api/chats', chatRouter)

export default app 