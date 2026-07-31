import { Payment } from "../models/Payment.js";
import {v4 as uuid4} from "uuid";
import { PAYMENT_CURRENCIES } from "../constants/PaymentCurrencies.js";
import { createPaymentSchema, getAllPaymentsQuerySchema, getPaymentParamsSchema } from "../validations/payment.validation.js";

//Create a Payment
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

//Get payment details by payment id
export async function getPayment(req,res){
    try {
        const params = req.params;

        if(!params){
            return res.status(400).json({
                message: "Path params not found in request!"
            });
        }

        const result = getPaymentParamsSchema.parse(params);
        const {paymentId} = result.data;

        const payment = await Payment.findOne({paymentId});

        return res.status(200).json(payment);


    }catch(error){
        console.error("Error fetching payment details!",error);
        return res.status(500).json({
            message: "An internal server error occurred while fetching payment details!"
        });
    }
}

//Get all payments
export async function getAllPayments(req,res){
    try{

        const query = req.query;

        if(!query){
            return res.status(400).json({
                message: "No query params in request!"
            });
        }

        const result = getAllPaymentsQuerySchema.parse(query);

        const {offset, limit } = result.data;

        const payments = await Payment.find({}).skip(offset).limit(limit);

        return res.status(200).json(payments);

    }catch(error){
        console.error("Error fetching all payments!",error);
        return res.status(500).json({
            message: "An internal server occurred while fetching all payments!"
        })
    }
}