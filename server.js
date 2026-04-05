import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json()); //express.json() is a middleware in Express.js that parses incoming JSON data and makes it available in req.body by converting it into js object

app.get('/', (req, res) => {
  res.json({ message: 'FixGenie API is running 🧞' }) //res.json sends a JSON response(string) toclient, express converts js obj to json string behind the scenes
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`FixGenie server running on port ${PORT}`))
