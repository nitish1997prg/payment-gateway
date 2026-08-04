import { Payment } from "../models/Payment.js";
import { Outbox } from "../models/OutboxEvent.js";
import {v4 as uuid} from "uuid";
import { publishEvent } from "../kafka/producer.js";
import { paymentCreatedEvent, paymentCapturedEvent } from "../events/paymentEvents.js";
import mongoose from "mongoose";
import { PAYMENT_EVENTS } from "../constants/PaymentEvents.js";
import { OUTBOX_STATUS } from "../enums/OutboxStatus.js";
import { AGGREGATE_TYPES } from "../constants/AggregateTypes.js";
import { PAYMENT_STATUS } from "../enums/PaymentStatus.js";

export async function createPayment(payment){
    try {
        let createdPayment;
        const session = await mongoose.startSession();

        session.startTransaction();

        try {

            createdPayment = await Payment.create(
            {
                paymentId: `pay_${uuid4()}`,
                merchantId: payment.merchantId,
                referenceId: payment.referenceId,
                amount: payment.amount,
                currency: payment.currency,
                customerId: payment.customerId
            },{
                session
            }
            );

            await Outbox.create({
                eventId: uuid(),
                aggregateType: AGGREGATE_TYPES.PAYMENT,
                aggregateId: createdPayment.paymentId,
                eventType: PAYMENT_EVENTS.CREATED,
                payload: paymentCreatedEvent(createdPayment),
                status: OUTBOX_STATUS.PENDING
            },
            {
                session
            }
            );

            await session.commitTransaction();


        }catch(error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
       

        //  await publishEvent(
        //         "payments",
        //         createdPayment.paymentId,
        //         paymentCreatedEvent(createdPayment)
        //     );

        return createdPayment;

    }catch(error){
        throw error;
    }
}

export async function getPayment(paymentId){
    try {
        const payment = await Payment.findOne({paymentId});

        if(!payment){
            throw new Error("Payment not found!");
        }

        return payment;

    }catch(error){
        throw error;
    }
}

export async function getAllPayments({offset=0, limit=10}){
    try {
        const payments = await Payment.find({}).skip(offset).limit(limit);

        return payments;
    }catch(error){
        throw error;
    }
}

export async function customerPayment(paymentId){
    try {
        let payment;
                
        const session = await mongoose.startSession();

        session.startTransaction();
        
        try {

            payment = await Payment.findOne({paymentId},null,{session});
        
            if(!payment){
                throw new Error("Payment not found!");
             }
        
             if(payment.status === "captured"){
                throw new Error("Payment has already been processed!");
                }

            payment.status = PAYMENT_STATUS.CAPTURED;

            await payment.save({session});

            await Outbox.create({
                eventId: uuid(),
                aggregateType: AGGREGATE_TYPES.PAYMENT,
                aggregateId: payment.paymentId,
                eventType: PAYMENT_EVENTS.CAPTURED,
                payload: paymentCapturedEvent(payment),
                status: OUTBOX_STATUS.PENDING
            },
            {
                session
            }
            );

            await session.commitTransaction();

        }catch(error){
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
        
        // await publishEvent(
        //         "payments",
        //         payment.paymentId,
        //         paymentCapturedEvent(payment)
        // );

        return {
            paymentId: payment.paymentId,
            status: PAYMENT_STATUS.CAPTURED
        };
        

    }catch(error){
        throw error;
    }
}

export const PaymentService = {
    createPayment,
    getPayment,
    getAllPayments,
    customerPayment
};