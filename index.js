import express from "express";
import cors from "cors";
import { PORT } from "./src/utils/unpublished.js";
import "./src/config/connection.js";
import seedDB from "./src/utils/seed_db.js";
import userRoute from "./src/routes/user.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
await seedDB();

app.use("/api/v1", userRoute)

app.listen(PORT, () => console.log(`service running on http://localhost:${PORT}`));