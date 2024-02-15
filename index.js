import express from "express";
import cors from "cors";
import { PORT } from "./src/utils/unpublished.js";
import "./src/config/connection.js";
import seedDB from "./src/utils/seed_db.js";

const app = express();
app.use(cors());

await seedDB();

app.get("/", (req, res) => {
    res.status(200).send({
        data: [1,2,3,4],
        message: "hello maman",
    })
})

app.listen(PORT, () => console.log(`service running on http://localhost:${PORT}`));