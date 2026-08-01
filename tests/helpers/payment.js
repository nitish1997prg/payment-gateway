import { Payment } from "../../models/Payment.js";
import { v4 as uuid4 } from "uuid";

export async function createTestPayment(overrides = {}) {
    return await Payment.create({
        paymentId: `pay_${uuid4()}`,
        merchantId: uuid4(),
        customerId: uuid4(),
        referenceId: uuid4(),
        amount: 100,
        currency: "INR",
        status: "created",
        ...overrides
    });
}