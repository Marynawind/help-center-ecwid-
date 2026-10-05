# Outlier USA — Help Center

Static prototype of the Help Center page for getoutlier.com (Ecwid). Built the
same way as the Backdraft Suppressors Help Center, without the buying guide.
No build step, no dependencies.

    python3 -m http.server 4387
    # http://127.0.0.1:4387/

Port 4321 is the shared default, but on this machine it (and 4322) were
already serving other projects' pages — check the `<title>` before trusting
what you see.

## Files

| File | What's in it |
|------|--------------|
| `index.html` | All content and page structure |
| `styles.css` | Brand tokens at the top of `.hc-root` — colours and fonts live there |
| `app.js` | Search, animated FAQ, deep links, section nav, back to top |
| `assets/watermark.svg` | The Outlier mark behind the page — the same file as Backdraft |
| `logo/` | Backdraft Suppressors by Outlier logo for business cards — see `logo/README.md` |
| `MY TEXT — needs your approval.md` | Every line on the page that isn't from the document |
| `Outlier FAQ — Barrels, Chassis & Ordering (2).docx` | The client's source text |

## Sections, in page order

1. **Hero + search.** Typing shows the matching answers themselves under the
   box: the top one open, the rest one click away, each linking back to its
   place in the FAQ.
2. **Section nav**, sticky: Orders · FAQ · Contact, as on Backdraft.
3. **Order Status, Changes, Returns & Exchanges.** Status (with the lead times),
   changes, cancellations, the full returns & exchanges policy, then incorrect
   or defective part, missing item and split shipment, each with its form.
4. **FAQ.** 55 questions under the document's five headings, with a jump strip
   to each, collapsible, unnumbered.
5. **Contact.** Deliberately quiet: small grey type at the very bottom, the
   forms first, the email address last.

There is no buying guide and no separate warranty section: the document's
warranty answer is one line ("Yes — all items carry a lifetime warranty."), so
it stays in the FAQ under General.

## Where the email appears

The brief: the email should be displayed very seldom and buried at the bottom.
`info@getoutlier.com` appears three times:

- in the client's own answers to "My shipment was lost in transit" and the
  Veteran / Military / Law Enforcement discount — both inside collapsed FAQ
  answers, so nobody sees it without opening one;
- as the last line of the Contact block at the foot of the page.

It is not in the hero, the order cards or the search fallback. The "Contact"
link in the section nav leads to the forms list, with the address last — the
same as on Backdraft. The site's own footer shows the address on every page;
that's the theme, not this page.

## Design

**Identical to the Backdraft Suppressors Help Center**
(backdraftsuppressors.com/help-center/), at the client's request. The rules in
`styles.css` are that page's rules one for one: Barlow 700 uppercase headings,
Roboto Condensed nav, buttons and table heads, Helvetica 14/21 body,
`#4e4e4e` text, `#333` buttons with 2px radius, white / `#f9f9f9` bands, the
Outlier watermark (`assets/watermark.svg`, the same file) behind the page.
Same hero button, tiles, sticky section nav (Orders · FAQ · Contact), category
strip and FAQ panels.

Compared side by side with the Backdraft page at 1440 and 390px: same
container, type, spacing and components; only the content differs.

One deliberate difference, at the client's request (2026-10-05): **no olive**.
Backdraft colours a linked card or answer, a hovered FAQ question, a hovered
search result and a hovered inline link `#6f6d49`; here they stay `#333`. A
hovered question still shows it through its +/− icon.

## Built for Ecwid from the start

The Outlier redemption page (September 2026) established what an Ecwid
"Embed & Custom Code" section actually accepts. This page is written to those
limits, so it won't need rewriting to go in:

- **No media queries.** A section containing `@media` is dropped silently,
  markup and all. Each of Backdraft's `max-width: 720px` rules is rewritten as
  an exact step, `clamp(PHONE, (100vw - 720.5px) * 9999, DESKTOP)`: the same
  breakpoint and the same two values, no ramp in between. The comment at the
  top of `styles.css` explains it.
- **No at-rules at all.** Entrance motion uses transitions toggled by a class,
  not `@keyframes`. `prefers-reduced-motion` is read in JavaScript, which then
  simply never adds the motion class.
- **Every class is prefixed `hc-` and every rule sits under `.hc-root`**, so the
  Ecwid theme can't override it and nothing leaks onto the rest of the store.
  A guard block re-sets bare `p`, `li`, headings and form controls inside the
  root, because a theme that styles `p` directly beats inheritance.
- **Works without JavaScript.** Answers are native `<details>`; the script only
  adds search, animation and conveniences.

Still to do before it goes in: section size. A section reliably takes about
3,900 characters, and this page is far bigger, so it will have to be cut into
pieces — CSS at rule boundaries, markup at section boundaries — the same way
`split.mjs` did for the redemption page. Whether an inline `<script>` survives
in a section hasn't been tested on this store yet; that needs a probe paste
before splitting.

## Content rule

**The text in the `.docx` is the client's. It is reproduced word for word**,
including the places that look like slips — see "Still open". A
paragraph-by-paragraph check finds all 292 paragraphs and table cells on the
page; the only lines not found verbatim are the nine "Form: https://…" labels
that became buttons.

Deliberate omissions:

| Omitted | Why |
|---|---|
| `1.` … `55.` before each question | The brief: the Q&A doesn't need to be numbered. (The document skips 18 and 51 anyway.) |
| `Form label: https://…` printed as text | The URL is on a button instead — see `MY TEXT` |
| Empty third column of the magazine table | It has no header and no content |

Bold and italic follow the document. The answer to "Can I substitute the
suppressor rebate…" is styled as a heading in the `.docx`; on the page it's an
ordinary answer.

The order cards repeat FAQ answers word for word (status, changes,
cancellations, returns, defective, missing, split). The FAQ keeps its copy so
search and deep links find them in either place.

## Client edits

Places where the page now deliberately differs from the `.docx`:

| Where | Change |
|---|---|
| Order status card and FAQ "What is the status of my order?" | "Login to your Account" → "Log in to your Account" — "log in" is the verb, "login" the noun |
| FAQ "Which actions are you not compatible with?" | "Faxon F7" → "Faxon FX7" — the client confirmed FX7 on 2026-10-05 |

## Deep links

Every answer has a stable id, so support can link straight to one, and a
linked answer opens itself: `…#faq-torque`, `…#faq-savage-prefit`,
`…#faq-rebate-redeem`, `…#hc-returns`.

## Forms

All twelve HubSpot forms in the document, plus dealers.getoutlier.com, the
redemption terms and the account page, return 200 (checked 1 October 2026).

## Still open — for the client

- **"16 "** in "Match Precision barrels: 16 ", 18", …" has a space before the
  inch mark; kept as written. Is it 16"? (Elsewhere the document uses 16.5".)
- **"Carbon Fiber - Mirage Reducing Barrel"** in the lengths answer uses a
  hyphen; the lead-times answer uses an en dash. Kept as written.
- **The Returns & Exchanges form URL** is the only one in a different format
  (`share-na2.hsforms.com/1XMQ7…`, not `c5bz3.share-na2…`). Confirmed by the
  client on 2026-10-05: it is the intended form.
- **Curtis** and **Faxon FX7** each appear both in "not compatible" and in the
  Remington 700 footprint list. ("Faxon F7" was corrected to FX7 by the client
  on 2026-10-05.) Kept as written — worth a look.

## Checks

    fe-lint .                 # CSS + markup: clean
    eslint app.js             # clean
    # axe-core wcag2a + wcag2aa, all answers open: 0 violations at 360/390/768/1024/1440
    # no horizontal scroll at any of those widths
    # no console errors, no failed requests
    # deep link opens its answer; with JavaScript off every answer is still reachable
