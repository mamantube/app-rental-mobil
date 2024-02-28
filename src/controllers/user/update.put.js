import userModel from "../../models/users.js";
import message from "../../utils/message.js";
import { z } from "zod";
import validation from "../../utils/validation.js";
import { Types } from "mongoose";
import storageModel from "../../models/storage.js";
import cloudinary from "cloudinary";

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
    const file = req.file;

    try {
        const body = req.body;
        const _id = req.params._id;
        const checkValidation = validation(schemaValidation, body);
        
        if (!checkValidation.success)
        return message(res, 422, "Validasi error", { errors: checkValidation.errors,});
    
        const findUserById = await userModel.findOne({ _id: new Types.ObjectId(_id), deleted_at: null, })
    
        if (!findUserById) return message(res, 404, "User tidak ditemukan")

        let payload = {}

        if (file) {

            const storage_id = findUserById._doc.storage_id;
            const findStorageId = await storageModel.findById({ _id: storage_id })

            if (findStorageId) {
                //delete file on cloudinary
                await cloudinary.v2.uploader.destroy(findStorageId._doc.public_id)
    
                //delete file on storage
                await storageModel.deleteOne({ _id: storage_id })
            }


            const uploadResult = await new Promise((resolve) => {
                cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                    return resolve(uploadResult);
                }).end(file.buffer);
            });

            //create document on storage
            const addToStorage = await storageModel.create({ public_id: uploadResult.public_id, secure_url: uploadResult.secure_url });

            payload.storage_id = addToStorage._doc._id;
        }

        const updateUser = await userModel.findByIdAndUpdate({ _id, deleted_at: null, }, {...payload, ...checkValidation.data}, { new: true});

        message(res, 200, "Data user berhasil diupdate", updateUser);
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    } finally {
        if (file && file.buffer) file.buffer = undefined;
    }
}