import UserModel from "@/models/userModel";
import { stripe } from "@/utils/stripe"
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

interface User {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (req.method === "POST") {
        // 1. Retrieve the information from request
        // const { data: price, metadata = {} } = await req.json();
        const body = await req.json();
        // console.log(body, "body")
        const { amount, id, metadata = {} } = body;


        // 2. Get the current user from session
        try {
            let user;
            if (session) {
                const userId = (session.user as User)?.id;
                user = await UserModel.findOne({ _id: userId })
            }
            // 3. Store the new customer in database in customers model
            //............................................................

            // 4. Create a checkout session in stripe
            let stripeSession;
            // console.log(price, "price", await req.json())
            // if (price.type === 'recurring') {
            stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                billing_address_collection: 'required',
                // customer,
                // add the customer here
                // customer_update: {
                //     address: 'auto'
                // },
                line_items: [
                    {
                        // name: "subscription",
                        price: id,
                        quantity: amount,
                    }
                ],
                mode: 'subscription',
                allow_promotion_codes: true,
                subscription_data: {
                    trial_from_plan: true,
                    metadata
                },
                success_url: `${getURL()}premium`,
                cancel_url: `${getURL()}/`
            });
            // }
            if (session) {
                // console.log(stripeSession)
                return new Response(JSON.stringify({ sessionId: stripeSession?.id }), {
                    status: 200
                });
            } else {
                return new Response(
                    JSON.stringify({
                        error: { statusCode: 500, message: 'Session is not defined' }
                    }),
                    { status: 500 }
                );
            }
        } catch (error: any) {
            console.log(error)
        }
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'POST' },
            status: 405
        });
    }
}

const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
};