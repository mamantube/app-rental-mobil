import userModel from "../../models/users.js";
import bcrypt from "bcrypt";
import message from "../../utils/message.js"
import { z } from "zod";
import validation from "../../utils/validation.js";
import roleModel from "../../models/roles.js";
import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../utils/unpublished.js"

const schemaValidation = z.object({
    "first_name": z.string().min(1, "Nama depan tidak boleh kosong").trim(),
    "last_name": z.string().min(1, "Nama belakang tidak boleh kosong").trim(),
    "phone": z.string().min(1, "Nomor Handphone tidak boleh kosong").regex(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, "Nomor handphone tidak valid"),
    "email": z.string().email("Email tidak valid"),
    "password": z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "Password anda tidak sesuai ketentuan") //Minimum six characters, at least one uppercase letter, one lowercase letter and one number
})

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
        const checkValidation = validation(schemaValidation, body);

        if(!checkValidation.success)
            return message(res, 422, "Error validation", {
        errors: checkValidation.errors,});

        const findUserbyEmail = await userModel.findOne({ email: checkValidation.data.email, deleted_at: null });

        if (findUserbyEmail)
            return message(res, 400, "Email sudah terdaftar");

        const findRoleCustomer = await roleModel.findOne({ name: "customer", deleted_at: null });
        
        const passwordHashing = bcrypt.hashSync(checkValidation.data.password, 10);

        const newUser = {
            ...checkValidation.data,
            password: passwordHashing,
            role_id: findRoleCustomer._doc._id,
        };

        await userModel.create(newUser)

        const token = Jwt.sign({ role_name: findRoleCustomer._doc.name }, SECRET_KEY, {expiresIn: "120"});
        
        message(res, 201, "Regist Success", { token, type: "Bearer"});    
    } catch (error) {
       message(res, 500, error?.message || "Internal server error")
    }
}