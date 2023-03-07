// dependencies
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routers/appRouter.js";

dotenv.config();

//APP
const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use(router);

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runing in PORT:${PORT} `));
