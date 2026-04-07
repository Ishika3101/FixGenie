import express from "express"
import {getAllProviders,searchProviders,getProviderById,updateProviderProfile} from "../controllers/providerController.js"
import protect from "../middleware/authMiddleware.js" //mw required for updatedProviderProfile function

const router=express.Router();

router.get("/",getAllProviders)
router.get("/search",searchProviders) //put specific router before dynamic router
router.get("/:id",getProviderById) //dynamic router as value of id always change
//protect runs first
router.put("/profile",protect,updateProviderProfile)

export default router

