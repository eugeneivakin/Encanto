// Track when Shopify cookie banner appears/closes
(function () {
  const BANNER_ID = "shopify-pc__banner";
  const BODY_CLASS = "shopify-cookie-banner-open";

  // Banner buttons
  const BANNER_ACCEPT_ID = "shopify-pc__banner__btn-accept";
  const BANNER_DECLINE_ID = "shopify-pc__banner__btn-decline";
  const BANNER_MANAGE_ID = "shopify-pc__banner__btn-manage-prefs";

  // Preferences
  const PREFS_ID = "shopify-pc__prefs";
  const PREFS_ACCEPT_ID = "shopify-pc__prefs__header-accept";
  const PREFS_DECLINE_ID = "shopify-pc__prefs__header-decline";
  const PREFS_SAVE_ID = "shopify-pc__prefs__header-save";
  const PREFS_CLOSE_ID = "shopify-pc__prefs__header-close";

  function updateBodyClass() {
    const banner = document.body.querySelector(`:scope > #${BANNER_ID}`);
    if (banner) {
      document.body.classList.add(BODY_CLASS);
    } else {
      document.body.classList.remove(BODY_CLASS);
    }
  }

  // Boot check
  document.addEventListener("DOMContentLoaded", updateBodyClass);
  // Checking for DOM changes
  const observer = new MutationObserver(updateBodyClass);
  observer.observe(document.body, { childList: true });

  // Remove class when closing banner (Accept/Decline)
  function removeBannerClass() {
    document.body.classList.remove(BODY_CLASS);
  }

  // Attach handlers to banner buttons
  function attachBannerButtonListeners() {
    const acceptBtn = document.getElementById(BANNER_ACCEPT_ID);
    const declineBtn = document.getElementById(BANNER_DECLINE_ID);
    const manageBtn = document.getElementById(BANNER_MANAGE_ID);
    if (acceptBtn) acceptBtn.addEventListener("click", removeBannerClass);
    if (declineBtn) declineBtn.addEventListener("click", removeBannerClass);
    // manageBtn does not close the banner, but opens the settings
  }

  // Attach handlers to buttons in settings (Accept all/Decline all/Save/Close)
  function attachPrefsButtonListeners() {
    const prefs = document.getElementById(PREFS_ID);
    if (!prefs) return;
    const acceptAll = document.getElementById(PREFS_ACCEPT_ID);
    const declineAll = document.getElementById(PREFS_DECLINE_ID);
    const save = document.getElementById(PREFS_SAVE_ID);
    const close = document.getElementById(PREFS_CLOSE_ID);
    // Accept all /Decline all /Save -close the banner
    [acceptAll, declineAll, save].forEach(btn => {
      if (btn) btn.addEventListener('click', removeBannerClass);
    });
    // Close -only closes the settings, does not touch the class on the body
    if (close) close.addEventListener('click', () => {
      // we don't do anything with the class
    });
  }

  // Monitor the appearance of the banner and prefs to attach handlers
  const domObserver = new MutationObserver(() => {
    attachBannerButtonListeners();
    attachPrefsButtonListeners();
  });
  domObserver.observe(document.body, { childList: true, subtree: true });

  // In case the elements already exist
  attachBannerButtonListeners();
  attachPrefsButtonListeners();
})();
