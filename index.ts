import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { NextFunction } from 'connect';
const userRoutes = require("./routes/user");
dotenv.config();
const cors = require("cors");
const app: Express = express();
const port = process.env.PORT;
app.use(cors())
// app.use(cors({origin: CORS_ORIGIN}))

app.use(express.json())

app.get('/hi', (req: Request, res: Response) => {
  res.status(200).send('Express ++= TypeScript Server');
});


// routes 
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});