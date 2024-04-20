import userModel from "../../models/users.js";
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
        const data = await userModel.aggregate([
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
                    _id: new Types.ObjectId(_id),
                    "role_detail.name": "customer",
                    deleted_at: null,
                },
            },
        ]);

        if(!data.length) return message(res, 404, "Data user tidak ditemukan");

        message(res, 200, "User detail", data[0])
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}