import userModel from "../../models/users.js";
import bcrypt from "bcrypt";
import message from "../../utils/message.js"

/**
 * 
 * @typedef {import("express").Request} ExpressRequest 
 * @typedef {import("express").Response} ExpressResponse
 */

/**
 * 
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 */

export default async function (req, res) {
    try {
        const body = req.body;
        message(res, 200, "Regist Success", body);    
    } catch (error) {
       message(res, 500, error?.message || "Internal server error")
    }
}