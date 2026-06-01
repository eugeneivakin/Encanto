(function () {
  // We get the translation string from Liquid (must be implemented via a data attribute or a global variable)
  var promoTemplate = window.promoBadgeTemplate || "";
  var promoCode = sessionStorage.getItem("promo_code");
  var isOnTargetCollection = window.location.pathname.startsWith("/collections/ctr-beauty-boxes");
  if (promoCode && promoTemplate && isOnTargetCollection) {
    var promoText = promoTemplate.replace(/\{\{\s*code\s*\}\}/g, promoCode);
    var description = document.querySelector(".collection-hero__description");
    if (description) {
      // Checking if there is already a badge after the description
      var next = description.nextElementSibling;
      var alreadyExists = next && next.classList && next.classList.contains("dame-discount-badge-overlay");
      if (!alreadyExists) {
        var badge = document.createElement("span");
        badge.className = "dame-discount-badge-overlay collection-hero__badge-promo";
        badge.textContent = promoText;
        description.parentNode.insertBefore(badge, description.nextSibling);
      }
    }
  }
})();
