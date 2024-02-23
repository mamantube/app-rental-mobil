import express from "express";
import Regist from "../controllers/user/register.post.js";
import Login from "../controllers/user/login.post.js";
import List from "../controllers/user/list.get.js";
import Detail from "../controllers/user/detail.get.js";
import Update from "../controllers/user/update.put.js";
import Restore from "../controllers/user/restore.patch.js";
import Remove from "../controllers/user/remove.delete.js";
import { authorization } from "../middleware/auth.js";


const userRoute = express.Router();

userRoute.post("/user/register", Regist);
userRoute.post("/user/login", Login);
userRoute.get("/user", authorization, List);
userRoute.get("/user/:_id", Detail);
userRoute.put("/user/:_id", Update);
userRoute.patch("/user/restore/:_id", Restore);
userRoute.delete("/user/remove/:_id", Remove);


export default userRoute;