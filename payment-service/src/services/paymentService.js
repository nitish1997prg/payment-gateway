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
import { logger } from "../utils/logger.js";
import { generateTraceId } from "../utils/trace.js";
import { withSpan } from "../telemetry/withSpan.js";

export async function createPayment(payment) {
    
    return withSpan("Create Payment", async (span) => {

        span.setAttributes({
            "payment.referenceId": payment.referenceId,
            "payment.amount": payment.amount,
            "payment.currency": payment.currency,
            "payment.merchantId": payment.merchantId
        });

        const traceId = generateTraceId();

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const createdPayment = new Payment({
                paymentId: `pay_${uuid()}`,
                merchantId: payment.merchantId,
                referenceId: payment.referenceId,
                amount: payment.amount,
                currency: payment.currency,
                customerId: payment.customerId
            });

            await withSpan("Save Payment", async () => {
                await createdPayment.save({ session });
            });

            span.setAttribute(
                "payment.paymentId",
                createdPayment.paymentId
            );

            await withSpan("Create Outbox Event", async () => {

                const outboxEvent = new Outbox({
                    eventId: uuid(),
                    aggregateType: AGGREGATE_TYPES.PAYMENT,
                    aggregateId: createdPayment.paymentId,
                    eventType: PAYMENT_EVENTS.CREATED,
                    payload: paymentCreatedEvent(createdPayment, traceId),
                    status: OUTBOX_STATUS.PENDING
                });

                await outboxEvent.save({ session });

            });

            await withSpan("Commit Transaction", async () => {
                await session.commitTransaction();
            });

            return createdPayment;

        } catch (error) {

            await session.abortTransaction();
            throw error;

        } finally {

            await session.endSession();

        }

    });
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

        const traceId = generateTraceId();
                
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

            const outboxEvent = new Outbox({
                eventId: uuid(),
                aggregateType: AGGREGATE_TYPES.PAYMENT,
                aggregateId: payment.paymentId,
                eventType: PAYMENT_EVENTS.CAPTURED,
                payload: paymentCapturedEvent(payment,traceId),
                status: OUTBOX_STATUS.PENDING
            })

            await outboxEvent.save({session});

            logger.info({
                eventId: outboxEvent.eventId,
                status: outboxEvent.status
            },"Outbox created");

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