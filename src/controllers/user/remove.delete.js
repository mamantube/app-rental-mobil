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
        const _id = req.params._id;
        const findUserById = await userModel.findOneAndUpdate({ 
            _id,
             deleted_at: null,
            },
            {deleted_at: new Date()}, {new: true}
        );

        if (!findUserById) return message(res, 404, "Data user tidak ditemukan")

        message(res, 200, "User berhasil dihapus", findUserById );
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}