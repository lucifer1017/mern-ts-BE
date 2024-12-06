import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDb } from "./config/database";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
dotenv.config();

const app:Express  = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/',authRouter);
app.use('/',profileRouter);


connectToDb()
    .then(() => {
        console.log("Connected to DB successfully");
        app.listen(process.env.PORT || 7070, () => {
            console.log(`Server running successfully on port:${process.env.PORT}`);
        });
    })
    .catch((err: unknown) => {  
        if (err instanceof Error) {
            console.error(`Cannot establish connection: ${err.message}`);
        } else {
            console.error("An unknown error occurred during DB connection");
        }
    });

