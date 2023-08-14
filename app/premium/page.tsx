"use client";

import getStripe from "@/utils/get-stripejs";
import { useState } from "react";

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    let response = await fetchPostJSON("/api/checkout_sessions", {
      amount: 4,
      id: "price_1NaxiYSDv14nZkVL8DehAQ9D",
    });

    // const response = await fetchPostJSON({
    //   url: "/api/create-checkout-session",
    //   data: { price: 4 },
    // });

    // //
    if (response?.status === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId: response.sessionId });
    // const { error } = await stripe!.redirectToCheckout({
    //   // Make the id field from the Checkout Session creation API response
    //   // available to this file, so you can provide it as parameter here
    //   // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    //   sessionId: response?.id,
    // });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    // console.warn(error.message);
    setLoading(false);
  };
  return (
    <button onClick={handleSubmit} disabled={loading}>
      Pay $4
    </button>
  );
}

export async function fetchPostJSON(url: string, data?: {}) {
  try {
    // Default options are marked with *
    // //
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (err: any) {
    // throw new Error(err.message);
    //
  }
}

// export const fetchPostJSON = async ({
//   url,
//   data,
// }: {
//   url: string;
//   data?: {};
// }) => {
//   //

//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: new Headers({ "Content-Type": "application/json" }),
//       credentials: "same-origin",
//       body: JSON.stringify(data),
//     });
//     //

//     return res.json();
//   } catch (err: any) {
//     //
//   }
// };
