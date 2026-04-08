import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import providerRouter from "./routes/providerRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import reviewRouter from "./routes/reviewRoutes.js"
import adminRouter from "./routes/adminRoutes.js"

dotenv.config();

connectDB();

const app=express();
app.use(cors());
app.use(express.json()); //express.json() is a middleware in Express.js that parses incoming JSON data and makes it available in req.body by converting it into js object
app.use("/api/auth",authRouter);//any request that starts with /api/auth — send it to authRouter
app.use("/api/providers", providerRouter);
app.use("/api/bookings",bookingRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/admin",adminRouter);

app.get('/', (req, res) => {
  res.json({ message: 'FixGenie API is running 🧞' }) //res.json sends a JSON response(string) toclient, express converts js obj to json string behind the scenes
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`FixGenie server running on port ${PORT}`))
