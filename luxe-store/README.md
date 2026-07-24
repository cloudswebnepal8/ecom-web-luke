# LUXE Store — Full Stack

A React + Tailwind storefront ("Objects Worth Owning") backed by a real Express + MongoDB Atlas API, with user accounts (JWT auth) and checkout.

```
luxe-store/
  src/            # React frontend (Vite, Tailwind, react-router-dom)
  server/         # Express API + Mongoose models, backed by MongoDB Atlas
```

## 1. Set up MongoDB Atlas (free tier is fine)

1. Create an account at https://www.mongodb.com/cloud/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a database user with a username/password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for "allow from anywhere" while developing).
4. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add a database name before the `?`, e.g. `.../luxe-store?retryWrites=true...`.

If `mongodb+srv://` fails to connect on your network (a `querySrv ECONNREFUSED` error), see the **Troubleshooting** section at the bottom — this is a common Windows/DNS issue with a simple fix.

## 2. Configure and run the backend

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill it in:

```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/luxe-store?retryWrites=true&w=majority
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=paste_a_long_random_string_here
```

Generate a `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Install dependencies, seed the product catalog, then start the API:

```bash
npm install
npm run seed   # populates MongoDB Atlas with the starter products (run once)
npm run dev    # starts the API on http://localhost:5000 with nodemon
```

You should see:
```
✔ MongoDB Atlas connected: cluster0-shard-...
✔ API running on http://localhost:5000
```

Verify it's alive: open http://localhost:5000/api/health → `{"status":"ok"}`.

## 3. Configure and run the frontend

In a **second terminal**, from the project root (not `server/`):

```bash
cp .env.example .env
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

## Accounts & checkout — how it works

- **Register** (`/register`) and **Login** (`/login`) create a real user in MongoDB Atlas (password hashed with bcrypt) and return a JWT, stored in the browser's `localStorage`.
- Browsing and adding to cart **works without an account** — an anonymous cart is tracked via a random guest ID.
- **Checkout requires login.** Clicking "Checkout" while logged out sends you to `/login` first; after logging in you're returned straight to checkout.
- **Guest cart merges into your account** the moment you log in — anything added before logging in carries over.
- Placing an order (`/checkout`) snapshots your cart into an `Order` document, empties the cart, and shows an order confirmation page.
- `/orders` lists your past orders; each links to `/orders/:id` for the full detail/confirmation view.

There's no real payment gateway wired up — orders are marked `paid` immediately on placement. Swap that logic out in `server/routes/orders.js` if you add Stripe/Razorpay/etc. later.

## Admin dashboard

There's a protected dashboard at **`/admin/orders`** that shows every order placed on the store — customer, items, total, date, and a status dropdown (pending/paid/shipped/delivered/cancelled) you can change per order. Click a row to expand it and see the full item list and shipping address.

Nobody is an admin by default. To make your account one:

```bash
cd server
npm run set-admin -- youremail@example.com
```

Then **refresh the page** on the site (the app re-checks your admin status via `/api/auth/me` on load). You'll now see "Admin dashboard" in your account menu.

## API reference

| Method | Route | Auth? | Description |
|---|---|---|---|
| GET | `/api/products` | – | List products. Query params: `category`, `search` |
| GET | `/api/products/:id` | – | Get one product |
| POST / PUT / DELETE | `/api/products/:id` | – | Create/update/delete a product (no admin gate yet — see below) |
| GET | `/api/cart/:cartId` | – | Get (or create) a cart |
| POST | `/api/cart/:cartId/items` | – | Add item `{ productId, qty }` |
| PUT | `/api/cart/:cartId/items/:productId` | – | Update quantity `{ qty }` |
| DELETE | `/api/cart/:cartId/items/:productId` | – | Remove item |
| POST | `/api/auth/register` | – | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | – | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | ✅ | Current user from token |
| POST | `/api/orders` | ✅ | `{ shippingAddress }` → creates order from cart, empties cart |
| GET | `/api/orders/mine` | ✅ | List the logged-in user's orders |
| GET | `/api/orders/:id` | ✅ | One order (must belong to the logged-in user) |
| GET | `/api/admin/orders` | ✅ admin | Every order, any customer |
| GET | `/api/admin/orders/:id` | ✅ admin | One order, any customer |
| PATCH | `/api/admin/orders/:id/status` | ✅ admin | `{ status }` — update order status |

Routes marked ✅ require an `Authorization: Bearer <token>` header — the frontend adds this automatically once you're logged in.

`cartId` is either a random guest UUID (`localStorage.luxe_guest_id`) or `user_<userId>` once logged in.

## Routes (frontend)

- `/` — home: hero, category filters, sort, search, product grid
- `/product/:id` — product detail
- `/cart` — cart, synced with the backend
- `/login`, `/register` — auth forms
- `/checkout` — shipping form + order summary (**requires login**)
- `/orders`, `/orders/:id` — order history and detail (**requires login**)
- any unknown path → 404

## Extending this

- **Admin protection**: the product CRUD routes (`POST/PUT/DELETE /api/products`) are currently open — add an `isAdmin` flag to `User` and a middleware check before exposing an admin UI.
- **Payments**: wire Stripe/Razorpay into `POST /api/orders` before marking an order `paid`.
- **Password reset / email verification**: not included — would need an email-sending service (e.g. Resend, SendGrid).
- **Deployment**: deploy `server/` to a Node host (Render, Railway, Fly.io, etc.) with `MONGODB_URI` and `JWT_SECRET` set as environment variables there, and point the frontend's `VITE_API_URL` at that deployed URL.

## Troubleshooting: `querySrv ECONNREFUSED` on Windows

Some Windows machines fail to resolve `mongodb+srv://` connection strings because Node's DNS resolver struggles with IPv6-only DNS servers, even though normal DNS lookups (`nslookup`) work fine. Two fixes:

1. **Quick fix** — add this to the top of `server/config/db.js`:
   ```js
   import dns from 'dns'
   dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
   ```
2. **If that doesn't work** — switch to the non-SRV connection string. Run `nslookup -type=SRV _mongodb._tcp.<your-cluster-host>` and `nslookup -type=TXT <your-cluster-host>` to get the shard hostnames and replica set name, then build a `mongodb://host1:27017,host2:27017,host3:27017/dbname?ssl=true&replicaSet=...&authSource=admin` style URI instead of `mongodb+srv://`.
