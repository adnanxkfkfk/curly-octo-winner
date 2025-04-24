import Razorpay from 'razorpay';
import { NowRequest, NowResponse } from '@vercel/node';
import { getFirebase, patchFirebase } from '../utils/firebase';
import { corsHeaders } from '../middleware/cors';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "OPTIONS") return res.setHeader("Access-Control-Allow-Origin", "*").status(200).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).json({ status: "fail", message: "Method not allowed" });

  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ status: "fail", message: "Missing booking ID" });

  const booking = await getFirebase(`bookings/${bookingId}`);
  if (!booking) return res.status(404).json({ status: "fail", message: "Invalid booking ID" });

  if (booking.payment === true) {
    return res.status(400).json({ status: "fail", message: "Already paid" });
  }

  if (booking.status === "pending") {
    return res.status(400).json({ status: "fail", message: "4096 - Order in pending" });
  }

  const order = await razorpay.orders.create({
    amount: 5000,
    currency: "INR",
    receipt: bookingId,
  });

  await patchFirebase(`bookings/${bookingId}`, {
    payment_orderid: order.id,
    amount: order.amount,
    status: "processing"
  });

  return res.status(200).json({ status: "success", order_id: order.id });
};
