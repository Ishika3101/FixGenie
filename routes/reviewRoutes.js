import express from "express"
import { addReview } from "../controllers/reviewController.js"
import protect from "../middleware/authMiddleware.js"
import { getProviderReviews } from "../controllers/providerController.js";

const router=express.Router();

router.post("/",protect,addReview)
router.get("/provider/:providerId",getAllProviders) //no protect neede because no req.user
//if user is already logged in then no need to check token and in getAllProviders no work of req.user

export default router

//protect middleware does 2 things:
// 1. Checks if token exists
// 2. Attaches req.user