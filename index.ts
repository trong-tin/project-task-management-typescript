import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/indexRoute";
import bodyParser from "body-parser";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

// CORS

// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));
app.use(cors());

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
