import { NowRequest, NowResponse } from '@vercel/node';
import { patchFirebase } from '../utils/firebase';

export default async (req: NowRequest, res: NowResponse) => {
  const { payload } = req.body;

  if (req.headers['x-razorpay-signature']) {
    const bookingId = payload?.payment?.entity?.receipt;
    if (bookingId) {
      await patchFirebase(`bookings/${bookingId}`, {
        payment: true,
        status: "confirmed"
      });
    }
  }

  res.status(200).send("Webhook received");
};
