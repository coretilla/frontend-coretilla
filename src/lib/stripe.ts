import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51RjWeyRpP4URq09nH7MbLZxJgAiKH8tRWAJDvPbOjRlmofCuu7hpE87BAupqKSPU8c4oMG6BFKNsLAAL2MJckLUD007vjH2iey";

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);