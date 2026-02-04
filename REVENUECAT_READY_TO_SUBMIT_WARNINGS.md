# RevenueCat "READY_TO_SUBMIT" Warnings – What They Mean & How to Fix

## What You're Seeing

```
Your products are configured in RevenueCat but aren't approved in App Store Connect yet.
Product Issues: pack_15, pack_50, pack_100 – status (READY_TO_SUBMIT) requires you to take action in App Store Connect before using it in production purchases.
```

**Good news:** Your products **are** loading. RevenueCat and App Store Connect are connected; offerings and product IDs are correct. These are **warnings**, not errors that block the app.

---

## What READY_TO_SUBMIT Means

| Status            | Meaning |
|-------------------|--------|
| **READY_TO_SUBMIT** | Product is fully set up (metadata, price, etc.) but **not yet submitted for review** (or not yet approved). |
| **Approved**      | Product has been reviewed and can be sold in **production**. |

- **Sandbox:** READY_TO_SUBMIT is usually enough. You can test purchases with a Sandbox account; the warnings are expected until you submit for review.
- **Production:** Apple requires products to be **approved** before real users can buy. Until then, RevenueCat will keep showing these warnings.

---

## For Sandbox Testing Only (Right Now)

**You don’t need to “fix” anything to keep testing.**

- Warnings are normal when products are READY_TO_SUBMIT.
- Sandbox purchases with a Sandbox Tester account typically work.
- You can ignore or acknowledge the warnings until you’re ready for production.

---

## For Production (When You Want Real Sales)

To clear the warnings and allow production purchases:

1. **App Store Connect** → Your app → **Features** → **In-App Purchases**.
2. For each product (**pack_15**, **pack_50**, **pack_100**):
   - Open the product.
   - Ensure all required fields are filled (name, description, price, screenshot if required).
   - Use **Submit for Review** (or add the IAP to an app version and submit the app with IAPs for review).
3. After Apple approves the in-app purchases, their status will change from READY_TO_SUBMIT to **Approved**.
4. RevenueCat will then stop showing these product/offering warnings for production.

In-app purchases can be submitted and approved even if the app itself is not yet on the store.

---

## Optional: Fewer Warnings in Logs

RevenueCat is warning because it sees READY_TO_SUBMIT. You can’t “turn off” the check, but you can:

- **Leave as-is** – Recommended; the warnings remind you to submit for production.
- Or **reduce log level** in development so fewer RevenueCat logs appear (your app code or RevenueCat config), but that doesn’t change the underlying status.

---

## Summary

| Goal              | Action |
|-------------------|--------|
| **Sandbox testing** | No fix required. Warnings are expected; test with a Sandbox account. |
| **Production sales** | In App Store Connect, submit each IAP (pack_15, pack_50, pack_100) for review and get them to **Approved**. |

Once the products are approved in App Store Connect, the RevenueCat warnings will go away for production.
