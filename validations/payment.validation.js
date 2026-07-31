import * as z from "zod";
import { PAYMENT_CURRENCIES } from "../constants/PaymentCurrencies.js";

export const createPaymentSchema = z.object({
    merchantId: z.uuidv4({error: "MerchantID is not a valid UUID!"}),
    referenceId: z.string().trim().min(1),
    amount: z.number({error: "Amount is not a valid number!"}).min(1,{error: "Amount should be atleast 1!"}),
    currency: z.enum(PAYMENT_CURRENCIES,{error: "Invalid currency value!"}),
    customerId: z.uuidv4({error: "CustomerId is not a valid UUID!"})
});

export const paymentParamsSchema = z.object({
    paymentId: z.string().trim().min(1)
});

export const getAllPaymentsQuerySchema = z.object({
    offset : z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().nonnegative().default(10),
}); 