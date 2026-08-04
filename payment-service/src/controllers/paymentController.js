import { Payment } from "../models/Payment.js";
import {v4 as uuid4} from "uuid";
import { createPaymentSchema, getAllPaymentsQuerySchema, paymentParamsSchema } from "../validations/payment.validation.js";
import { ZodError } from "zod";
import { publishEvent } from "../kafka/producer.js";
import { paymentCreatedEvent, paymentCapturedEvent } from "../events/paymentEvents.js";
import { PaymentService } from "../services/paymentService.js";

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

        const createdPayment = await PaymentService.createPayment(result);

        return res.status(201).json({
            paymentId: createdPayment.paymentId,
            status: createdPayment.status,
            amount: createdPayment.amount,
            currency: createdPayment.currency
        });

    }catch(error){
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues
            });
        }

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

        const result = paymentParamsSchema.parse(params);
        const {paymentId} = result;

        const payment = await PaymentService.getPayment(paymentId);


        return res.status(200).json(payment);


    }catch(error){
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues
            });
        }
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

        const {offset, limit } = result;

        const payments = await PaymentService.getAllPayments({offset: offset,limit: limit});

        return res.status(200).json(payments);

    }catch(error){
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues
            });
        }
        console.error("Error fetching all payments!",error);
        return res.status(500).json({
            message: "An internal server error occurred while fetching all payments!"
        })
    }
}

//Customer Payment
export async function customerPayment(req,res){
    try {
        const params = req.params;

        if(!params){
            return res.status(400).json({
                message: "Request params missing in request!"
            });
        }

        const result = paymentParamsSchema.parse(params);

        const {paymentId} = result;

        const payment = await PaymentService.customerPayment(paymentId);
        
        return res.status(200).json({
            message: "Payment has been captured successfully!"
        });


    }catch(error){
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: error.issues
            });
        }
        console.error("Error in customer payment!",error);
        return res.status(500).json({
            message: "An internal server error occurred while customer payment! "
        });
    }
}

export const PaymentController = {
    createPayment,
    getPayment,
    getAllPayments,
    customerPayment
}

export default PaymentController;