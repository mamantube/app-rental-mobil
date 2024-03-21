import productModel from "../../../models/products.js";
import message from "../../../utils/message.js";
import { Types } from "mongoose";
import transactionModel from "../../../models/transaction.js";
import validation from "../../../utils/validation.js";
import { z } from "zod";

const schemaValidation = z.object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
}).refine((data) => {
    return !data.end_date || data.start_date <= data.end_date
}, "Start_date tidak boleh lebih dari end_date")

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
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;
        
        const checkValidation = validation(schemaValidation, req.query)
        
        if(!checkValidation.success)
            return message(res, 422, "Validasi error", {
                errors: checkValidation.errors,
            });

        const findTransaction = await transactionModel.find({
            $or: [
                {
                    "rental_duration.start_date": { $lte: new Date(end_date) },
                    "rental_duration.end_date": { $gte: new Date(start_date) },
                },
            ],
            status: { $nin: ["failure", "refund"] },
            deleted_at: null,
        });

        let product_ids = findTransaction.map((transaction) => transaction._doc.product_ids).flat();

        // const _id = req.params._id;
        const detail = await productModel.aggregate([
            {
                $match: {
                    _id: { $nin: product_ids},
                },
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

        message(res, 200, "Detail pproduk", detail[0], product_ids)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}