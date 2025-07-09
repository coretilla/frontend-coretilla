Refactor the navigation bar for a Bitcoin Neobank app built using:

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- shadcn/ui
- Lucide icons

### 📱 Problem:
The navbar is overloaded with individual menu links: Home, Dashboard, Deposit, Swap, Stake, Lending, Fiat, DCA, Analyzer, etc. Even with icons, it's too wide and not usable on mobile devices.

---

### ✅ Objective:
Create a **clean, grouped, and responsive navbar** that is user-friendly on both desktop and mobile.

### 🧭 Solution:

1. **Group Menu Items Into Dropdowns**:
   Organize related links under labeled dropdowns:
   - **Products**:
     - Deposit
     - Swap
     - Fiat
   - **Investing**:
     - Stake
     - Lending
     - DCA
   - **Tools**:
     - Dashboard
     - Analyzer

   Use `DropdownMenu` or `Popover` from `shadcn/ui`.

2. **Desktop Layout**:
   - Show `Bitcoin Neobank` logo
   - Display 3 grouped dropdowns (Products, Investing, Tools)
   - Show Bitcoin price next to grouped menus
   - "Sign In" and "Register" as buttons on the far right

3. **Mobile Layout**:
   - Collapse all into a hamburger menu
   - Use `Sheet` or `Drawer` from `shadcn/ui` for mobile
   - Inside the drawer, use collapsible sections for Products, Investing, Tools
   - Display Bitcoin price and CTA buttons inside drawer too

4. **General Features**:
   - Sticky navbar with shadow on scroll
   - Icon + label inside dropdown items
   - Highlight active link
   - Add hover/focus transitions

---

### 📁 File Suggestions:

- `components/Navbar.tsx`
- `components/MobileMenu.tsx`
- `components/MenuGroupDropdown.tsx` (shared dropdown for Products, Investing, Tools)
- `lib/navItems.ts` — central config for nav grouping

---

### 📌 Additional Notes:

- Use Tailwind classes like `hidden md:flex`, `flex-col gap-2`, `group-hover`, etc.
- Focus on usability: prioritize large click/tap areas
- Avoid hydration mismatch
- Use mock icons from Lucide for consistency

---

### ⚙️ Output Request:
Generate full `Navbar.tsx` and `MobileMenu.tsx` files using clean code and component-driven structure. Include logic to determine current route, dropdown open/close states, and responsive behavior.
