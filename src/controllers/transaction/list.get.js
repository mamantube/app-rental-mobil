import transactionModel from "../../models/transaction.js";
import message from "../../utils/message.js";




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
        const q = req.query.q || "";
        const sort_by = req.query.sort_by ? req.query.sort_by : "desc";
        const page = req.query.page ? Number(req.query.page) : 1;
        const per_page = req.query.page ? Number(req.query.per_page) : 10;
        const skip = page > 1 ? (page - 1) * per_page : 0;

        const filters = [
            {
                $match: {
                    $or: [
                        { order_id: { $regex: q, $options: "i"} },
                        { transaction_id: { $regex: q, $options: "i"} },
                        { "product_detail.name": { $regex: q, $options: "i"} },
                    ],
                    deleted_at: null,
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "user_id",
                    as: "user_detail"
                },
            },
            {
                $unwind: "$user_detail",
            },
            {
                $lookup: {
                    from: "products",
                    foreignField: "_id",
                    localField: "product_ids",
                    as: "product_detail"
                }
            },
            {
                $project: {
                    "user_detail.password": 0,
                }
            },

        ];

        const data = await transactionModel.aggregate(filters).sort( { _id: sort_by }).skip(skip).limit(per_page);

        const countDocuments = await transactionModel.aggregate(filters).count("total");

        const pagination = {
            page,
            per_page,
            total: countDocuments.length ? countDocuments[0].total : 0,
        };


        
        message(res, 200, "Daftar transaksi", data, pagination);
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}