# Stripe Integration Setup

This project includes Stripe integration for processing research request payments.

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Getting Stripe Keys

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to the Stripe Dashboard
3. Navigate to Developers > API keys
4. Copy your Publishable key and Secret key
5. For testing, use the test keys (they start with `pk_test_` and `sk_test_`)

## Features

- **Embedded Checkout**: Uses Stripe's embedded checkout for a seamless payment experience
- **Fixed Pricing**: Single price of $100 for all research requests
- **Payment Success Handling**: Automatic redirect to success page with payment confirmation
- **Metadata Tracking**: Stores research request details with each payment

## Components

- `src/services/stripe.ts` - Stripe service functions
- `src/server/api/routers/stripe.ts` - tRPC endpoints for Stripe operations
- `src/components/stripe-checkout.tsx` - Embedded checkout component
- `src/components/checkout-success.tsx` - Success page component

## Usage

The research request form automatically handles the checkout flow:

1. User fills out research request form
2. Clicks "Checkout" button
3. Stripe embedded checkout appears
4. After successful payment, user is redirected to success page
5. Payment details and metadata are stored in Stripe

## Testing

Use Stripe's test card numbers for testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

For more test cards, see [Stripe's testing documentation](https://stripe.com/docs/testing). 