import message from "../../utils/message.js";
import transactionModel from "../../models/transaction.js";
import validation from "../../utils/validation.js";
import { z } from "zod";

const schemaValidation = z.object({ 
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
}).refine((data) => {
    return !data.end_date || data.start_date <= data.end_date;
}, "start_date tidak boleh lebih besar dari pada end_date");


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
            return message(res, 404, "Transaksi tidak ditemukan")

        const { start_date } = findTransaction._doc.rental_duration;
        const today = new Date();
        const timeDifference = start_date.getTime() - today.getTime();
        const hourDifference = timeDifference / ( 1000 * 60 * 60);
        const isBefore24Hours = hourDifference >= 24;

        if (!isBefore24Hours)
            return message(res, 400, "Maaf, tidak dapat merubah tanggal penyewaan karena sudah masuk tanggal penyewaan");

        const detail = await transactionModel.findOneAndUpdate(
            { _id }, 
            { ...checkValidation.data, status: "refund" },
            { new: true},
        );

        message(res, 200, "Refund berhasil", detail)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error")
    }
}