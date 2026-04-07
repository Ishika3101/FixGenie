import express from "express"
import {createBooking,getMyBookings,updateBookingStatus} from "../controllers/bookingController.js"
import protect from "../middleware/authMiddleware.js" //because we want protect mw as we want req.user in all three routes

const router=express.Router()

router.post("/",protect,createBooking)
router.get("/",protect,getMyBookings)
router.put("/:id",protect,updateBookingStatus) //this id is booking id not customer or providers id when customer created booking and booked provider then this id is created in the document

export default router