SS FASHION POINT — storefront landing page
============================================

WHAT'S IN THIS FOLDER
  index.html          → the page (open this / set as your wrapper page)
  css/styles.css      → all styling
  js/main.js          → shop logic, cart, Shopify connection, hero scrub
  js/tweaks.js         → design-tweaks panel (only shows inside the Claude
                         editor — it will NOT appear on your live site)
  assets/             → images + the hero video (hero-model.mp4) + poster

HOW TO UPLOAD
  Keep the folder STRUCTURE exactly as-is (index.html at the top, with the
  css/, js/ and assets/ folders next to it). All paths are relative, so as
  long as the four items sit together it will work on any host / wrapper.

SHOPIFY
  - Live products, collections and CHECKOUT are pulled from your store
    (qg006p-r6.myshopify.com) using your Storefront token, which is already
    set in js/main.js. Whatever you add in Shopify shows up here.
  - Taxes & delivery are NOT set in this code — they come from your Shopify
    settings at checkout.
  - "Sign in / Sign up" links to your real Shopify account login.
  - If you ever rotate the Storefront token, update it near the top of
    js/main.js (look for the SHOPIFY config).

NOTES
  - hero-model.mp4 is the largest file; keep it in assets/ so the hero plays.
  - The "Tweaks" panel is a design tool for the editor only and stays hidden
    on the published site.
