import mongoose from "mongoose";
import { URL_MONGODB } from "../utils/unpublished.js";

try {
    await mongoose.connect(URL_MONGODB);

    console.log("DB has been connected ")
} catch (error) {
    console.error("failed connect to DB", error)
}