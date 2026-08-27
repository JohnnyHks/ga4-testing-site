# GA4 Testing Site

Small static ecommerce sandbox for testing Google Analytics 4 and Google Tag Manager.

## Included events

- `page_view` via GA4 config
- `select_promotion`
- `generate_lead`
- `view_item`
- `add_to_cart`
- `begin_checkout`
- `purchase`

## Connect GA4 directly

Open `analytics.js` and replace:

```js
const GA4_MEASUREMENT_ID = "G-REPLACE_ME";
```

with your Web Data Stream measurement ID, for example:

```js
const GA4_MEASUREMENT_ID = "G-ABC1234567";
```

Keep `GTM_CONTAINER_ID` empty.

The configuration enables `debug_mode`, so test events can be inspected in GA4 DebugView as well as Realtime.

## Connect Google Tag Manager instead

Open `analytics.js` and set:

```js
const GTM_CONTAINER_ID = "GTM-XXXXXXX";
```

When GTM is configured, the site pushes ecommerce event objects into `dataLayer`. Configure your GA4 tags/triggers inside GTM rather than sending GA4 events directly from this file.

## Publish with GitHub Pages

In the GitHub repository:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**.
5. Save.

The site should then be available at:

`https://johnnyhks.github.io/ga4-testing-site/`

## Suggested test journey

1. Open the home page.
2. Click **Generate test lead**.
3. Open **Products**.
4. Click **View item** on a product.
5. Click **Add to cart**.
6. Go to **Checkout**.
7. Complete the fake purchase.
8. Inspect GA4 Realtime and DebugView.

No payment or backend exists; all cart data is kept in browser `localStorage`.