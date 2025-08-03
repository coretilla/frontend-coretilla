import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51RjWeyRpP4URq09nH7MbLZxJgAiKH8tRWAJDvPbOjRlmofCuu7hpE87BAupqKSPU8c4oMG6BFKNsLAAL2MJckLUD007vjH2iey";

// Validate Stripe key
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('❌ Missing Stripe publishable key');
}

console.log('🔑 Loading Stripe with key:', STRIPE_PUBLISHABLE_KEY ? 'Key found' : 'Key missing');

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);