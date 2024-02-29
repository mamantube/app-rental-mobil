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

        const detail = await productModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "storages",
                    foreignField: "_id",
                    localField: "storage_id",
                    as: "storage_detail",
                },
            },
            {
                $unwind: "$storage_detail",
            }
        ]);

        if (!detail.length)
            return message(res, 404, "Produk tidak ditemukan")

        message(res, 200, "Detail pproduk", detail[0])
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}