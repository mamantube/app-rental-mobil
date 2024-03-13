import express from "express";
import Create from "../controllers/product/create.post.js";
import { authentication, admin} from "../middleware/auth.js"
import UploadImg from "../middleware/uploadImg.js";
import listAdm from "../controllers/product/listAdm.get.js";
import Detail from "../controllers/product/detail.get.js";
import Remove from "../controllers/product/remove.delete.js";
import Restore from "../controllers/product/restore.patch.js";
import Update from "../controllers/product/update.put.js";

const productRoute = express.Router();

productRoute.post("/product/new", authentication, admin, UploadImg, Create);
productRoute.get("/product", authentication, admin, listAdm);
productRoute.get("/product/:_id", authentication, admin, Detail);
productRoute.delete("/product/remove/:_id", authentication, admin, Remove);
productRoute.patch("/product/restore/:_id", authentication, admin, Restore);
productRoute.put("/product/:_id", authentication, admin, UploadImg, Update);

export default productRoute;