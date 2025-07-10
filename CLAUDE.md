Refactor the navigation bar of a Bitcoin Neobank frontend built with:

- Next.js (App Router)
- TailwindCSS
- TypeScript
- shadcn/ui components
- Lucide icons

### Goal:
Optimize the navigation bar for **mobile devices**. Currently, the navbar contains too many menu items: Home, Dashboard, Deposit, Swap, Stake, Lending, Fiat, DCA, Analyzer, BTC Price, Sign In/Register — which makes it overwhelming on smaller screens.

---

### Requirements:

1. **Responsive Navbar Design:**
   - On desktop: display full menu horizontally (as currently designed)
   - On mobile/tablet:
     - Collapse navigation into a **hamburger menu**
     - Use a **sliding drawer (left or right)** with smooth transitions
     - Show grouped links inside the drawer, with sections like:

       ```
       💰 Transactions
         - Deposit
         - Swap
         - Fiat

       📈 Investing
         - Stake
         - DCA
         - Lending

       📊 Tools
         - Dashboard
         - Analyzer
       ```

     - Include buttons for “Sign In” and “Register” in the drawer footer

2. **Sticky Navbar Behavior:**
   - Make the navbar sticky at the top
   - Add a subtle shadow on scroll

3. **BTC Price Section:**
   - Keep Bitcoin price info on top bar or visible in the drawer header
   - Use mock BTC price and % change

4. **UX Design Notes:**
   - Ensure **easy one-handed navigation** on mobile
   - Prioritize tap targets and spacing
   - Maintain orange CoreDAO theme

---

### Technical:
- Use `Navbar.tsx` as a reusable component
- Implement `MobileDrawer.tsx` using `shadcn/ui`'s `Sheet`, `Dialog`, or `Popover`
- Place menu link items in a `navItems.ts` config file for maintainability
- Use Tailwind for transitions and responsiveness (`sm:hidden`, `md:flex`, etc.)
- Avoid re-renders or hydration issues on mobile
- Keep the UX fast and accessible

Please generate:
- Updated `Navbar.tsx`
- New `MobileDrawer.tsx` (or inside Navbar)
- `navItems.ts` config structure
- Tailwind classes and component structure for both desktop and mobile layouts
