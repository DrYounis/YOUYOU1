# 🟢 Supabase Setup for Younis Store

You already have Supabase configured! Just need to add the store tables and storage bucket.

## Step 1: Run SQL Setup Script

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Copy and paste the contents of `supabase_store_setup.sql`
6. Click **"Run"** (or press `Ctrl+Enter`)

This will create:
- ✅ `orders` table with all required fields
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Storage policies for image uploads

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Enter bucket name: `puzzle-images`
4. Toggle **"Public bucket"** to ON
5. Click **"Create bucket"**

The SQL script already includes policies to allow uploads and reads.

## Step 3: Verify Environment Variables

Make sure your `.env.local` has your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

These should already be configured from your existing setup!

## Step 4: Test the Store

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/store`

3. Test the full flow:
   - Upload a photo
   - Fill in customer details
   - Select payment method
   - Review and submit

4. Check Supabase Dashboard:
   - **Table Editor**: You should see a new row in the `orders` table
   - **Storage**: You should see the uploaded image in `puzzle-images` bucket

## Step 5: Access Admin Panel

1. Go to `http://localhost:3000/store/admin`

2. Enter the admin password (default: `younis2024`)
   - To change this, edit `/app/store/admin/page.js` and update the `ADMIN_PASSWORD` constant

3. You should see:
   - All orders listed
   - Order details (customer, delivery, payment)
   - Ability to mark payments as confirmed
   - Ability to update delivery status
   - Export to JSON or CSV

## 📋 Database Structure

The `orders` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Auto-generated order ID |
| `created_at` | TIMESTAMP | When order was created |
| `customer_name` | TEXT | Customer's full name |
| `phone` | TEXT | Customer's phone number |
| `email` | TEXT | Customer's email |
| `delivery_type` | TEXT | "school" or "home" |
| `school_name` | TEXT | School name (if school delivery) |
| `home_address` | TEXT | Full address (if home delivery) |
| `home_city` | TEXT | City (if home delivery) |
| `home_phone` | TEXT | Delivery contact phone |
| `payment_method` | TEXT | "bank_transfer" or "apple_pay" |
| `price` | NUMERIC | Order price (default: 50) |
| `currency` | TEXT | Currency (default: "SAR") |
| `status` | TEXT | "pending" or "paid" |
| `delivery_status` | TEXT | "pending", "preparing", "ready", "delivered" |
| `delivery_updated_at` | TIMESTAMP | Last delivery status update |
| `image_url` | TEXT | Public URL of uploaded puzzle image |
| `payment_confirmed_at` | TIMESTAMP | When payment was confirmed |
| `notes` | TEXT | Admin notes |

## 🔒 Security Notes

### Current Setup (Simple)
- Anyone can create orders (needed for store to work)
- Only authenticated users can read/update orders (admin only)

### For Production (Recommended)
If you want to protect the admin panel properly:

1. **Enable Supabase Auth** for admin access:
   ```javascript
   // In admin page, add login with Supabase Auth
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@younisstore.com',
     password: 'your-secure-password'
   });
   ```

2. **Update RLS policies** to require authentication for all operations except order creation

3. **Change admin password** in `/app/store/admin/page.js`

## 💰 Pricing & Payment Notes

- **Price**: Fixed at 50 SAR (edit in `/app/store/page.js` - `PRICE` constant)
- **Bank Transfer**: Customer transfers manually, admin confirms in admin panel
- **Apple Pay**: Currently shows as option but requires Stripe/Apple Pay SDK for real processing

### To Add Real Apple Pay:

1. Sign up for [Stripe](https://stripe.com)
2. Install Stripe SDK: `npm install @stripe/stripe-js`
3. Replace the Apple Pay button with Stripe's Payment Element
4. Create API route for payment processing

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding env variables

### "Permission denied" on upload
- Check storage bucket `puzzle-images` exists and is public
- Verify storage policies are applied

### Orders not showing in admin
- Check `orders` table exists in Supabase
- Verify RLS policies allow authenticated reads
- Check browser console for errors

### Image upload fails
- Check storage bucket exists and is public
- Verify storage policies allow inserts
- Check image is under 10MB

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Storage Guide: https://supabase.com/docs/guides/storage
- Database Guide: https://supabase.com/docs/guides/database

---

**Happy Selling! 🧩**
