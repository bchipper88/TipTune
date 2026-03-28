import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const TRANSACTION_FEE_CENTS = 20; // $0.20 flat fee per transaction
