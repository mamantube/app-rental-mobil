import productModel from "../../models/products.js";
import message from "../../utils/message.js";
import { Types } from "mongoose"

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
        const _id = req.params._id;

        const findProductById = await productModel.findOneAndUpdate({ _id, deleted_at: null }, {deleted_at: new Date()}, {new: true} );

        if (!findProductById)
            return message(res, 404, "Produk tidak ditemukan")

        message(res, 200, "Produk masuk ke dalam daftar perbaikan")
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}