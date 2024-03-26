import { response } from "express";
import transactionModel from "../../models/transaction.js";
import message from "../../utils/message.js";
import { MIDTRANSS_URL_API, MIDTRANS_SERVER_KEY } from "../../utils/unpublished.js"

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
        const order_id = req.params.order_id;

        const findTransaction = await transactionModel.findOne({
            order_id,
            deleted_at: null,
        });

        if (!findTransaction)
            return message(res, 404, "Transaksi tidak ditemukan");

        const url = `${MIDTRANSS_URL_API}/v2/${order_id}/status`;

        const token = btoa(MIDTRANS_SERVER_KEY + ":")

        const response = await fetchData(url, token);

        const { 
            status_code,
            status_message,
            transaction_id,
            transaction_status,
            fraud_status,
         } = response
        

        if ([404].includes(Number(status_code)))
            return message(res, Number(status_code), `${status_message} please check your transactions`)

        if (![200, 201].includes(Number(status_code))) {
            let status =  "";
    
            if (transaction_status == 'capture') {
                if (fraud_status == 'challenge') {
                    status = "chalenge";
                } else if (fraud_status == 'accept') {
                    status = "success";
                }
            } else if (transaction_status == 'settlement'){
              status = "success"
            } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
              status = "failure";
            } else if (transaction_status == 'pending'){
              status = "pending";
            } else if (transaction_status == 'refund'){
              status = "refund";
            };

            const payload = {
                transaction_id,
                status,
            }
    
            const transactionDetail = await transactionModel.findOneAndUpdate({ order_id }, payload, { new: true })
            
            return message(res, 200, "Cek status transaksi", transactionDetail);
        }

        message(res, Number(status_code), status_message)
    } catch (error) {
        message(res, 500, error?.message || "Server internal error");
    }
}

async function fetchData(url = "", token = undefined) {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    });
    return response.json()
};