import express from 'express';
import { upload } from '../configs/multer';
import UserController from '../controllers/user-controller';
import PropertyController from '../controllers/property-controller';

const apiRouter = express.Router()

const propertyUpload = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "view", maxCount: 1 }
])

apiRouter.post("/user/login", UserController.login)
apiRouter.post("/user/register", UserController.register)

apiRouter.get("/property/list", PropertyController.list)
apiRouter.get("/property/get/:id", PropertyController.get)
apiRouter.post("/property/add", propertyUpload, PropertyController.add)
apiRouter.put("/property/update/:id", propertyUpload, PropertyController.update)
apiRouter.delete("/property/remove/:id", PropertyController.remove)

export default apiRouter

