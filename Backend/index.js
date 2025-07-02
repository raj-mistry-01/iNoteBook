const dotenv = require("dotenv");
dotenv.config();
const connectToMongo = require("./db")
connectToMongo()
const express = require("express")
const cors = require("cors")
const app = express()
const port = 7000
// app.use(cors())
const allowedOrigins = [
    "http://localhost:5173",
    "https://inote-pied.vercel.app/"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed for this origin"));
            }
        },
    })
);

// importing routes from routes folder
app.use(express.json())
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))
app.use("/api/userStats", require("./routes/usernotesinfo"))
app.get("/api/getcheck", (req, res) => {
    res.json({ "ok": "ok" })
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

module.exports = app;