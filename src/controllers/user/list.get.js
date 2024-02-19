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

        const data = await userModel.aggregate([
            {
                $match: {
                    $or: [
                        {first_name: { $regex: q, $options: "i"}},
                        {last_name: { $regex: q, $options: "i"}},
                        {email: { $regex: q, $options: "i"}},
                        {phone: { $regex: q, $options: "i"}},
                    ],
                    deleted_at: null,
                }
            },
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
            }
        ])
        message(res, 200, "Data user", data)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}