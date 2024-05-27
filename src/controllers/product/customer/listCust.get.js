import productModel from "../../../models/products.js";
import message from "../../../utils/message.js";
// import transactionModel from "../../../models/transaction.js";
// import validation from "../../../utils/validation.js";
// import { z } from "zod";

// const schemaValidation = z.object({
//     start_date: z.coerce.date(),
//     end_date: z.coerce.date(),
// }).refine((data) => {
//     return !data.end_date || data.start_date <= data.end_date
// }, "Start_date tidak boleh lebih dari end_date")

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
        // const start_date = req.query.start_date;
        // const end_date = req.query.end_date;

        // const checkValidation = validation(schemaValidation, req.query)

        // if(!checkValidation.success)
        //     return message(res, 422, "Validasi error", {
        //         errors: checkValidation.errors,
        //     });

        // const findTransaction = await transactionModel.find({
        //     $or: [
        //         {
        //             "rental_duration.start_date": { $lte: new Date(end_date) },
        //             "rental_duration.end_date": { $gte: new Date(start_date) },
        //         },
        //         {
        //             "rental_duration.start_date": { $gte: new Date(start_date), $lte: new Date(end_date)},
        //         },
        //         {
        //             "rental_duration.end_date": { $gte: new Date(start_date), $lte: new Date(end_date)},
        //         },
        //     ],
        //     status: { $nin: ["failure", "refund"] },
        //     deleted_at: null,
        // });

        // let product_ids = findTransaction.map((transaction) => transaction._doc.product_ids).flat();

        const q = req.query.q || "";
        // const sort_by = req.query.sort_by ? req.query.sort_by : "desc";
        const page = req.query.page ? Number(req.query.page) : 1;
        const per_page = req.query.per_page ? Number(req.query.per_page) : 10;
        const skip = page > 1 ? (page - 1 ) * per_page : 0;


        const filter = [
            // {
            //     $match: {
            //         name: { $regex: q, $options: "i"},
            //         _id: { $nin: product_ids},
            //         deleted_at: null,
            //     },
            // },
            // {
            //     $lookup: {
            //         from: "storages",
            //         foreignField: "_id",
            //         localField: "storage_id",
            //         as : "storage_detail",
            //     },
            // },
            // {
            //     $unwind: "$storage_detail"
            // },
            {
                $match: {
                    name: { $regex: q, $options: "i" },
                    deleted_at: null,
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
        ];

        const data = await productModel.aggregate(filter).sort({ _id: "desc" }).skip(skip).limit(per_page);

        const countDocuments = await productModel.aggregate(filter).count("total");

        const pagination = {
            page,
            per_page,
            total: countDocuments.length ? countDocuments[0].total : 0,
        };

        message(res, 200, "List product", data, pagination);
        
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}