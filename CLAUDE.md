🎯 GOAL:
Implement a loading animation or skeleton screen when users navigate to key pages:
- /deposit
- /swap
- /stake
- /lending
- /dca
- /analyzer
- /faucet

This is to enhance UX during route changes and prevent users from seeing white flashes or layout jumps.

---

🧩 TECH TO USE:
- **Next.js (App Router)**
- **Tailwind CSS**
- **Framer Motion** (for fade-in/out or spinner)
- Optional: **nprogress** or custom loader component

---

📁 FILES TO INCLUDE:
/components/ui/RouteLoader.tsx
/app/layout.tsx or /app/(pages)/layout.tsx


---

💡 BEHAVIOR:
- Show spinner or skeleton while new page is loading
- Only show loader on first navigation or during network delay
- Animate entrance/exit of the page content
- Use `useTransition()` or `router.events` from `next/navigation`

---

🔧 IMPLEMENTATION STRATEGY (Option 1 - with `useTransition()`):

1. Wrap page links or buttons (e.g., in Navbar) with logic:

```tsx
'use client';
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();

const handleClick = () => {
  startTransition(() => {
    router.push('/deposit');
  });
};
