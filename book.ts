import { NowRequest, NowResponse } from '@vercel/node';
import { isValidEmail, isValidPhone } from '../utils/validate';
import { generateBookingId } from '../utils/generateId';
import { saveToFirebase } from '../utils/firebase';
import { corsHeaders } from '../middleware/cors';

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "OPTIONS") return res.setHeader("Access-Control-Allow-Origin", "*").status(200).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).json({ status: "fail", message: "Method not allowed" });

  const { name, email, phone, origin_address, origin_pincode, destination_address, destination_pincode, vehicle_type, service_type, approx_weight, approx_packages } = req.body;

  if (!name || !email || !phone || !origin_address || !origin_pincode || !destination_address || !destination_pincode || !vehicle_type || !service_type) {
    return res.status(400).json({ status: "fail", message: "Missing required fields" });
  }

  if (!isValidEmail(email) || !isValidPhone(phone)) {
    return res.status(400).json({ status: "fail", message: "Invalid email or phone number" });
  }

  const bookingId = generateBookingId();
  const data = {
    name,
    email,
    phone,
    origin_address,
    origin_pincode,
    destination_address,
    destination_pincode,
    vehicle_type,
    service_type,
    approx_weight: approx_weight || null,
    approx_packages: approx_packages || null,
    status: "pending",
    payment: false
  };

  await saveToFirebase(`bookings/${bookingId}`, data);
  return res.status(200).json({ status: "success", bookingId });
};
