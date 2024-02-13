import express from "express"

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.status(200).send({
        data: [1,2,3,4],
        message: "hello maman",
    })
})

app.listen(PORT, () => console.log(`service running on http://localhost:${PORT}`));