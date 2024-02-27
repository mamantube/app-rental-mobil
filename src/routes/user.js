import express from "express";
import Regist from "../controllers/user/register.post.js";
import Login from "../controllers/user/login.post.js";
import List from "../controllers/user/list.get.js";
import Detail from "../controllers/user/detail.get.js";
import Update from "../controllers/user/update.put.js";
import Restore from "../controllers/user/restore.patch.js";
import Remove from "../controllers/user/remove.delete.js";
import { authentication, validateUserId, admin, customer } from "../middleware/auth.js";


const userRoute = express.Router();

userRoute.post("/user/register", Regist);
userRoute.post("/user/login", Login);
userRoute.get("/user", authentication, admin, List);
userRoute.get("/user/:_id", authentication, Detail);
userRoute.put("/user/:_id", authentication, validateUserId, customer, Update);
userRoute.patch("/user/restore/:_id", authentication, admin, Restore);
userRoute.delete("/user/remove/:_id", authentication, admin, Remove);


export default userRoute;