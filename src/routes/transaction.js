import express from "express";
import Checkout from "../controllers/transaction/checkout.post.js";
import { authentication, customer} from "../middleware/auth.js"
import List from "../controllers/transaction/list.get.js";
import Detail from "../controllers/transaction/detail.get.js";

const transactionRoute = express.Router();

transactionRoute.post("/transaction/checkout", authentication, customer, Checkout)
transactionRoute.get("/transaction", authentication, List);
transactionRoute.get("/transaction/:_id", authentication, Detail);

export default transactionRoute;