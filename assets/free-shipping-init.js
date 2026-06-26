(function () {
  var formatted = null;

  function computeFormatted() {
    var currency = (window.Shopify && window.Shopify.currency) || { active: 'EUR' };
    var active = currency.active;
    var rawCents;

    var arabCurrencies = ['AED', 'QAR', 'SAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'IQD', 'LBP', 'LYD', 'MAD', 'DZD', 'TND', 'YER', 'SDG', 'SYP'];
    if (arabCurrencies.indexOf(active) !== -1) {
      rawCents = window.FREE_SHIPPING.arabCents;
    } else {
      rawCents = window.FREE_SHIPPING.euCents;
    }

    // Use page language so Polish gets "648 zł" not "648 PLN".
    // For Arabic script, fall back to 'en' so numerals stay Western
    // (consistent with Shopify's own money-format output on the page).
    var pageLang = document.documentElement.lang || '';
    var locale = /^ar|^he|^fa|^ur/.test(pageLang) ? 'en' : (pageLang || undefined);
    try {
      formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: active,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(rawCents / 100);
    } catch (e) {
      formatted = (rawCents / 100).toFixed(0) + ' ' + active;
    }
  }

  // Replace stale EUR amounts that Hexton injected from its cached translation.
  // The regex covers the € symbol and the word "euro/euros/EUR" in every script
  // Hexton translates it to (Arabic: يورو, Cyrillic: евро, Latin: euro/euros).
  function fixHextonElements() {
    if (!formatted) return;
    var active = window.Shopify && window.Shopify.currency && window.Shopify.currency.active;
    if (active === 'EUR') return; // Hexton cache is correct for EUR visitors

    // Matches:  €150  150€  150 €  150 euros  150 EUR  150 يورو  150 евро
    var eurRe = /€\s*[\d]+(?:[.,]\d+)?|[\d]+(?:[.,]\d+)?\s*(?:€|[Ee]uros?|EUR|يورو|евро)/g;

    [
      '.announcement-bar__message',
      '.icon-with-text__item .inline-richtext',
      '.icon-with-text__item .h4'
    ].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var next = el.innerHTML.replace(eurRe, formatted);
        if (next !== el.innerHTML) el.innerHTML = next;
      });
    });
  }

  computeFormatted();

  // Primary fix: Hexton applies its client-side translations shortly after load
  setTimeout(fixHextonElements, 800);
  // Fallback for slow Hexton loads
  setTimeout(fixHextonElements, 1500);

  // Fix dynamically injected content (quick-buy modals, section reloads)
  // childList only — no characterData to avoid body-wide text-change cost
  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      Array.from(m.addedNodes).forEach(function (n) {
        if (n.nodeType !== 1) return;
        var has = (n.matches && n.matches('.icon-with-text__item, .announcement-bar__message')) ||
          (n.querySelector && n.querySelector('.icon-with-text__item, .announcement-bar__message'));
        if (has) setTimeout(fixHextonElements, 150);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
