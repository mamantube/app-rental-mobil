import productModel from "../../models/products.js";
import message from "../../utils/message.js";
import validation from "../../utils/validation.js";
import cloudinary from "cloudinary";
import { z } from "zod";
import storageModel from "../../models/storage.js";

const schemaValidation = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong").max(25, "Nama tidak boleh lebih dari 25 karakter").trim(),
    price: z.number().int().positive(),
    description: z.string().min(20, "Deskripsi minimal harus 20 karakter").max(250, "Deskripsi tidak boleh lebih dari 250 karakter").trim(),
});

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
        const _id = req.params._id;

        const findProductById = await productModel.findOne({ _id, deleted_at: null });

        if (!findProductById) 
            return message(res, 404, "Produk tidak ditemukan")
        
        const body = req.body;
        const checkValidation = validation(schemaValidation, {
            ...body,
            price: Number(body.price)
        });

        if (!checkValidation.success)
            return message(res, 422, "Validasi error", {
                errors: checkValidation.errors,
            })

        let payload = {}

        if (file) {
            const storage_id = findProductById._doc.storage_id;
            const findImgStoragId = await storageModel.findById({ _id: storage_id})

            await cloudinary.v2.uploader.destroy(findImgStoragId._doc._id)
            await storageModel.deleteOne({ _id: storage_id });

            const uploadResult = await new Promise((resolve) => {
                cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                    return resolve(uploadResult)
                }). end(file.buffer)
            })
            
            const addToStorage = await storageModel.create({ public_id: uploadResult.public_id, secure_url: uploadResult.secure_url });

            payload.storage_id = addToStorage._doc._id;
        }

        const updateProduct = await productModel.findByIdAndUpdate(
            { _id },
            { ...payload, ...checkValidation.data },
            { new: true }
        )


        message(res, 200, "Produk berhasil diperbarui", updateProduct)


        
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    } finally {
        if (file && file.buffer) file.buffer = undefined;
    }
}