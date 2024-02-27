import userModel from "../../models/users.js";
import message from "../../utils/message.js";
import { z } from "zod";
import validation from "../../utils/validation.js";
import { Types } from "mongoose";


const schemaValidation = z.object({
    "first_name": z.string().min(1, "Nama depan tidak boleh kosong").trim(),
    "last_name": z.string().trim(),
    "phone": z.string().min(1, "Nomor Handphone tidak boleh kosong").regex(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, "Nomor handphone tidak valid"),
    "email": z.string().email("Email tidak valid"),
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
        const _id = req.params._id;
        const checkValidation = validation(schemaValidation, body);
        
        if (!checkValidation.success)
        return message(res, 422, "Validasi error", { errors: checkValidation.errors,});
    
        const findUserById = await userModel.findOne({ _id: new Types.ObjectId(_id), deleted_at: null, })
    
        if (!findUserById) return message(res, 404, "User tidak ditemukan")
    
        const file = req.file;

        if (file) {}
        
        const updateUser = await userModel.findByIdAndUpdate({ _id, deleted_at: null, }, {...checkValidation.data}, { new: true});

        message(res, 200, "Data user berhasil diupdate", updateUser, file);
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}