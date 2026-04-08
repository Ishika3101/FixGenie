import express from "express"
import isAdmin from "../middleware/adminMiddleware.js"
import protect from "../middleware/authMiddleware.js"
import { getAllBookings,approveProvider, deleteUser, getAllUsers } from "../controllers/adminController.js"

const router=express.Router()

//in all routes we need protect and isAdmin mw because isAdmin needs req.user
router.get("/",protect,isAdmin,getAllUsers)
router.put("/approve/:providerId",protect,isAdmin,approveProvider)
router.delete("/:id",protect,isAdmin,deleteUser)
router.get("/bookings",protect,isAdmin,getAllBookings)

export default router
