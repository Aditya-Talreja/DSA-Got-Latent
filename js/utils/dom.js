/* ========================================================
   DSA Got Latent — DOM Helper Utilities
   ======================================================== */

export const $ = (sel, context = document) => context.querySelector(sel);
export const $$ = (sel, context = document) => context.querySelectorAll(sel);
