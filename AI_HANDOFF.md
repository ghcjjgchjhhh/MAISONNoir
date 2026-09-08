# Maison Noir AI Handoff

This document is the operating guide for the next AI/developer. Preserve the existing architecture and make additive, focused changes.

## Project

- App: Maison Noir luxury fashion storefront
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Firebase Web SDK
- Local folder: `c:\Users\PC\Downloads\untitled(2)`
- GitHub: `https://github.com/ghcjjgchjhhh/MAISONNoir`
- Branch: `main`
- Firebase project: `maison-noir-a6dbb`
- Firebase live site: `https://maison-noir-a6dbb.web.app`
- Vercel live site: `https://maison-noir-eight-sepia.vercel.app`
- Admin identity: `ifeanyianoma2@gmail.com`

## Run Locally

```powershell
cd "c:\Users\PC\Downloads\untitled(2)"
npm install
npm run dev
```

Local URL: `http://localhost:3000`

## Validate Before Deploying

```powershell
npm run lint
npm run build
```

The build may show a Vite chunk-size warning. It is not currently a build failure.

## Deploy Everything

Use PowerShell from the project root:

```powershell
npm run lint
npm run build
git status --short
git add .
git commit -m "Describe the change"
git push origin main
vercel --prod --yes
firebase deploy --only hosting --project maison-noir-a6dbb
```

Do not commit `.env.local`, `dist`, `.vercel`, `.firebase`, or secrets.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values privately:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
GEMINI_API_KEY
APP_URL
```

The Firebase project values must point to `maison-noir-a6dbb`. Vite variables prefixed with `VITE_` are browser-visible configuration; never put private server secrets in them.

## Firebase Setup

1. Open the Firebase project: `https://console.firebase.google.com/project/maison-noir-a6dbb/overview`
2. Enable Authentication with the Google provider.
3. Add these Authentication authorized domains:
   - `maison-noir-a6dbb.web.app`
   - `maison-noir-eight-sepia.vercel.app`
4. Ensure Firestore is enabled.
5. Deploy rules when rules change:

```powershell
firebase deploy --only firestore:rules --project maison-noir-a6dbb
```

6. Deploy Hosting:

```powershell
firebase deploy --only hosting --project maison-noir-a6dbb
```

The repository contains `firebase.json`, `.firebaserc`, and `firestore.rules`.

## Data Architecture

The main shared application state is in `src/context/AppContext.tsx`.

Firestore document:

```text
stores/maison-noir
```

The document contains:

- `products`
- `orders`
- `customers`
- `inventoryLogs`
- `notifications`
- `discounts`
- `marketingBanners`
- `storeSettings`
- `schemaVersion`
- `catalogSeeded`

Important behavior:

- Product catalog uses `INITIAL_PRODUCTS` from `src/data/mockData.ts` when the shared product list is empty.
- Customers are created/updated after real Google sign-in.
- Orders are created after checkout and matched to customers by email.
- Admin dashboard and storefront consume the same AppContext state.
- Wishlist, recently viewed, addresses, and reviews are scoped in local storage by Firebase user ID.
- The email sign-in form is a local fallback; real customer identity requires Google sign-in.

## Main Files

- `src/App.tsx`: top-level routing between storefront, Account, and admin views.
- `src/context/AppContext.tsx`: auth, products, cart, orders, customers, Firestore sync, navigation state.
- `src/firebase.ts`: Firebase app, Auth, Firestore, and Google provider setup.
- `src/components/AccountPage.tsx`: signed-in customer portal.
- `src/components/AdminDashboard.tsx`: admin workspace.
- `src/components/ProductCatalog.tsx`: storefront products.
- `src/components/Header.tsx`: account, admin, install, cart, and storefront controls.
- `src/components/SplashScreen.tsx`: startup loading screen.
- `src/components/InstallAppButton.tsx`: PWA install prompt.
- `src/index.css`: safe-area, Android edge-to-edge, splash, and global styles.
- `public/manifest.webmanifest`: installable app metadata.
- `public/sw.js`: app-shell service worker.
- `src/types.ts`: canonical TypeScript types.
- `src/data/mockData.ts`: initial product catalog and default store settings.

## Admin Access

The admin check is in `checkIsAdmin()` in `src/context/AppContext.tsx`. It currently recognizes the target identity by email/name and the `admin` role.

Do not broaden admin access casually. A real production system should use Firebase custom claims or a server-side role document instead of string matching.

Admin flow:

1. Sign in with Google using the approved admin account.
2. Open **Admin HQ** or the admin dashboard control.
3. Manage products, orders, inventory, customers, discounts, marketing, analytics, notifications, and settings.

## Customer Account

After Google sign-in, click the profile/account control. The Account page includes:

- Profile and connected Google email
- Orders and order details
- Wishlist
- Cart shortcut
- Addresses
- Rewards and admin-created discount codes
- Recently viewed products
- Notification preferences
- Purchase-verified reviews
- Settings, policy, help, sign out, and delete-account warning

## Mobile App Behavior

The site is an installable PWA, not an APK or Play Store app.

- Android: open the Firebase URL in Chrome and choose **Install App**.
- iPhone: open in Safari, choose **Share**, then **Add to Home Screen**.
- `viewport-fit=cover` and safe-area CSS are already configured.
- Do not add custom edge-swipe handlers. Android/iOS must retain Back, Home, and Recent Apps gestures.

## Common Problems

### Google sign-in does not open

Check:

- Google provider is enabled in Firebase Authentication.
- The current domain is in Firebase Authentication authorized domains.
- Browser pop-ups are allowed.
- The Firebase environment values point to `maison-noir-a6dbb`.

### Cloud data unavailable

Check Firestore access and rules:

```powershell
firebase projects:list
firebase firestore:databases:list --project maison-noir-a6dbb
firebase deploy --only firestore:rules --project maison-noir-a6dbb
```

### Products are missing

The original product catalog is `INITIAL_PRODUCTS` in `src/data/mockData.ts`. The current AppContext restores it only when the shared Firestore product array is empty. Do not reset customers or orders just to restore products.

### Old UI is showing

Use a hard refresh or add a query string to the URL. Firebase Hosting sends `index.html` with no-store headers.

## Safe Change Rules

- Do not replace the existing storefront or admin dashboard.
- Do not restore fake customers, fake orders, or fake analytics.
- Keep customer data scoped to the signed-in Firebase user.
- Validate with `npm run lint` and `npm run build` after edits.
- Deploy Firebase Hosting and Vercel only after validation.
- Never commit credentials, API secrets, or `.env.local`.
- Do not commit changes unless the user asks for a commit/deployment or deployment is part of the current request.
