import { NowRequest, NowResponse } from '@vercel/node';
import { getFirebase } from '../utils/firebase';
import { corsHeaders } from '../middleware/cors';

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "OPTIONS") return res.setHeader("Access-Control-Allow-Origin", "*").status(200).end();

  res.setHeader("Access-Control-Allow-Origin", "*");

  const bookingId = req.query.bookingId as string;
  if (!bookingId) return res.status(400).json({ status: "fail", message: "Missing booking ID" });

  const data = await getFirebase(`bookings/${bookingId}`);
  if (!data) return res.status(404).json({ status: "fail", message: "Booking not found" });

  return res.status(200).json({
    status: "success",
    tracking_status: data.status || "pending",
    updates: data.updates || {}
  });
};
