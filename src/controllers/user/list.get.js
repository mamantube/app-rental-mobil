import userModel from "../../models/users.js";
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

        const filter = [
            {
                $lookup: {
                    from: "roles",
                    foreignField: "_id",
                    localField: "role_id",
                    as: "role_detail",
                },
            },
            {
                $unwind: "$role_detail",
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
                $unwind: {
                    path: "$storage_detail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    storage_detail: {
                        $ifNull: ["$storage_detail", null]
                    }
                }
            },
            {
                $project: {
                    password: 0,
                }
            },
            {
                $match: {
                    $or: [
                        {first_name: { $regex: q, $options: "i"}},
                        {last_name: { $regex: q, $options: "i"}},
                        {email: { $regex: q, $options: "i"}},
                        {phone: { $regex: q, $options: "i"}},
                    ],
                    "role_detail.name": "customer",
                    deleted_at: null,
                },
            },
            
        ]

        const data = await userModel.aggregate(filter).sort({ _id: sort_by }).skip(skip).limit(per_page);

        const countDocument = await userModel.aggregate(filter).count("total")

        const pagination = {
            page,
            per_page,
            total: countDocument.length ? countDocument[0].total : 0,
        }
        message(res, 200, "Data user", data, pagination)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}