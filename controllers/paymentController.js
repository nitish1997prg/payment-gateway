import { Payment } from "../models/Payment.js";
import {v4 as uuid4} from "uuid";
import { validateUuid } from "../utils/validateUuid.js";
import { PAYMENT_CURRENCIES } from "../constants/PaymentCurrencies.js";
import { createPaymentSchema } from "../validations/payment.validation.js";

export async function createPayment(req,res){
    try {
        const body = req.body;

        if(!body){
            return res.status(400).json({
                message: "Request Body is missing!"
            });
        }

        const result = createPaymentSchema.parse(body);

        const {merchantId , referenceId, amount, currency, customerId} = result.data;

        const createdPayment = await Payment.create(
            {
                paymentId: uuid4(),
                merchantId,
                referenceId,
                amount,
                currency,
                customerId
            }
        );

        return res.status(201).json({
            paymentId: createdPayment.paymentId,
            status: createdPayment.status,
            amount: createdPayment.amount,
            currency: createdPayment.currency
        });

    }catch(error){
        console.error("Error creating payment!",error);
        return res.status(500).json({
            message: "An internal server error occurred while creating a payment!"
        });
    }
}