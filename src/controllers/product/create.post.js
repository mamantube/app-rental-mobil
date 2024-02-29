import productModel from "../../models/products.js";
import message from "../../utils/message.js";
import { z } from "zod"
import validation from "../../utils/validation.js";
import cloudinary from "cloudinary";
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
        const body = req.body;
        const checkValidation = validation(schemaValidation, {
            ...body, price: Number(body.price
        )});

        if (!checkValidation.success) 
            return message(res, 422, "Validasi error", {
            errors: checkValidation.errors,
        });

        if (!file) 
            return message(res, 422, "Validasi error", {
            errors: [{path: "image", message: "Gambar tidak boleh kosong"}]
        });

        const uploadResult = await new Promise((resolve) => {
            cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                return resolve(uploadResult)
            }).end(file.buffer);
        });

        const addToStorage = await storageModel.create({
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
        });

        let payload = {
            ...checkValidation.data,
            storage_id: addToStorage._doc._id,
        }

        await productModel.create(payload);

        message(res, 201, "Produk berhasil dibuat");
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    } finally {
        if (file && file.buffer) file.buffer = undefined;
    }
}