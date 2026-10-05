# Return Policy page for getoutlier.com

Replaces the store's current **Return Policy** page
(`getoutlier.com/products/pages/returns`, linked from the footer of every
page). The old text contradicts the client's FAQ document, and the client
confirmed on 2026-10-05 that the document is right:

| | Old page | Client's `.docx` |
|---|---|---|
| Cancel after production started | 35% restocking fee | $35 restocking fee |
| Incorrectly ordered part | "We will not refund" | Subject to the return/exchange terms below |
| After shipping | "No refunds once an Outlier product has shipped" | Refund minus $35; exchange $15 / $35 |

## What's on it

Everything is the client's own words from
`Outlier FAQ — Barrels, Chassis & Ordering (2).docx`, the same text as the
Help Center's order cards: the Returns & Exchanges policy with the fees,
order changes, cancellations, incorrect or defective part, missing item, and
the HubSpot form for each. The only words of ours are the section headings
(Order Changes, Order Cancellations, …), the same card headings the Help
Center uses — listed in `MY TEXT — needs your approval.md`.

Left out on purpose:

- **Split shipment** and **lead times** — shipping, not returns. They stay in
  the Help Center.
- **"All orders will be shipped within 2-5 days of completion"** from the old
  page — the document doesn't say it, and its lead times are counted
  differently. Ask the client if they want it back.

The form links are plain text links, not buttons: this page has no styles of
its own and takes the store's.

## Where it goes

Ecwid admin → **Settings → General → Legal Pages → Return Policy** → Edit.
Paste `return-policy.html` in the editor's HTML / source mode, so the
headings, lists and links survive.

⚠️ Not yet tried in this store's editor — check the result on the live page
after saving.

Once the Help Center has an address, a line pointing to it can go at the top.
