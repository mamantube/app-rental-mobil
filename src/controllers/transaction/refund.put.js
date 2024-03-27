import message from "../../utils/message.js";
import transactionModel from "../../models/transaction.js";
import validation from "../../utils/validation.js";
import { z } from "zod";

const schemaValidation = z.object({
    refund_date: z.coerce.date().refine((value) => {
        let toDay = new Date();
        toDay.setHours(toDay.getHours() - 24);
        return value > toDay;
    }, "Refund tidak bisa dilakukan karena sudah masuk waktu penyewaan"),
    note_refund: z.string().min(10, "Masukkan minimal 10 karakter").max(50, "Masukkan maksimal 50 karakter")
})


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
        const body = req.body;

        const checkValidation = validation(schemaValidation, body)

        if (!checkValidation.success)
            return message(res, 422, "Validasi error", {
            errors: checkValidation.errors,
            });
        
        const _id = req.params._id;

        const findTransaction = await transactionModel.findOne({
            _id,
            status: { $eq: "success" },
            deleted_at: null
        })

        if (!findTransaction)
            return message(res, 404, "Transaksi tidak ditemukna")
        
        message(res, 200, "Refund berhasil", checkValidation, findTransaction)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}