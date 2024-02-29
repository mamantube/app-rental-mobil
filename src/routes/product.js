import express from "express";
import Create from "../controllers/product/create.post.js";
import { authentication, admin} from "../middleware/auth.js"
import UploadImg from "../middleware/uploadImg.js";
import listAdm from "../controllers/product/listAdm.get.js";

const productRoute = express.Router();

productRoute.post("/product/new", authentication, admin, UploadImg, Create);
productRoute.get("/product", authentication, admin, listAdm);

export default productRoute;