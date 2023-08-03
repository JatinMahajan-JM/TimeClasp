// import { buffer } from 'micro';
// import Cors from 'micro-cors';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { stripe } from "@/utils/stripe"

// import Stripe from 'stripe';
// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// //   // https://github.com/stripe/stripe-node#configuration
// //   apiVersion: '2020-03-02',
// // });


// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// // Stripe requires the raw body to construct the event.
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const cors = Cors({
//     allowMethods: ['POST', 'HEAD'],
// });

// const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === 'POST') {
//         const buf = await buffer(req);
//         const sig = req.headers['stripe-signature']!;

//         let event: Stripe.Event;

//         try {
//             event = stripe.webhooks.constructEvent(
//                 buf.toString(),
//                 sig,
//                 webhookSecret
//             );
//         } catch (err: any) {
//             // On error, log and return the error message.
//             console.log(`❌ Error message: ${err.message}`);
//             res.status(400).send(`Webhook Error: ${err.message}`);
//             return;
//         }

//         // Successfully constructed event.
//         console.log('✅ Success:', event.id);

//         // Cast event data to Stripe object.
//         if (event.type === 'payment_intent.succeeded') {
//             const paymentIntent = event.data.object as Stripe.PaymentIntent;
//             console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
//         } else if (event.type === 'payment_intent.payment_failed') {
//             const paymentIntent = event.data.object as Stripe.PaymentIntent;
//             console.log(
//                 `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
//             );
//         } else if (event.type === 'charge.succeeded') {
//             const charge = event.data.object as Stripe.Charge;
//             console.log(`💵 Charge id: ${charge.id}`);
//         } else {
//             console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
//         }

//         // Return a response to acknowledge receipt of the event.
//         res.json({ received: true });
//     } else {
//         res.setHeader('Allow', 'POST');
//         res.status(405).end('Method Not Allowed');
//     }
// };

// export default cors(webhookHandler as any);

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe';
import { headers } from 'next/headers';

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = headers().get('Stripe-Signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.log(`❌ Error message: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    //   await upsertProductRecord(event.data.object as Stripe.Product);
                    break;
                case 'price.created':
                case 'price.updated':
                    //   await upsertPriceRecord(event.data.object as Stripe.Price);
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    console.log(event.data.object)
                    const subscription = event.data.object as Stripe.Subscription;
                    //   await manageSubscriptionStatusChange(
                    //     subscription.id,
                    //     subscription.customer as string,
                    //     event.type === 'customer.subscription.created'
                    //   );
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        // await manageSubscriptionStatusChange(
                        //   subscriptionId as string,
                        //   checkoutSession.customer as string,
                        //   true
                        // );
                    }
                    break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (error) {
            console.log(error);
            return new Response(
                'Webhook handler failed. View your nextjs function logs.',
                {
                    status: 400
                }
            );
        }
    }
    return new Response(JSON.stringify({ received: true }));
}