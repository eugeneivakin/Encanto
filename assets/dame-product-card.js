// dame-product-card.js
// Handles swatch hover/click interactions for all .dame-product-card elements.

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.dame-product-card .dame-product-img').forEach(function (img) {
    img.dataset.originalSrc = img.src;
    img.dataset.originalSrcset = img.srcset || '';
  });

  function setImage(img, url) {
    if (!img || !url) return;
    img.srcset = '';
    img.src = url;
  }

  function restoreImage(img) {
    if (!img) return;
    img.src = img.dataset.originalSrc || '';
    img.srcset = img.dataset.originalSrcset || '';
  }

  // Format price: only € symbol, no EUR suffix
  function formatMoney(cents) {
    if (!cents && cents !== 0) return '';
    var amount = (parseInt(cents, 10) / 100).toFixed(2);
    return '€' + amount.replace('.', ',');
  }

  function updatePrice(card, swatch) {
    var priceContainer = card.querySelector('.dame-product-price');
    if (!priceContainer) return;
    var variantPrice = swatch.dataset.variantPrice;
    var variantComparePrice = swatch.dataset.variantComparePrice;
    if (!variantPrice) return;
    var price = parseInt(variantPrice, 10);
    var comparePrice = variantComparePrice ? parseInt(variantComparePrice, 10) : 0;
    if (comparePrice && comparePrice > price) {
      var discount = Math.round((comparePrice - price) * 100 / comparePrice);
      priceContainer.innerHTML =
        '<span class=dame-price-original>' + formatMoney(comparePrice) + '</span>' +
        '<span class=dame-price-sale>' + formatMoney(price) + '</span>' +
        '<span class=dame-price-badge>-' + discount + '%</span>';
    } else {
      priceContainer.innerHTML =
        '<span class=dame-price-current>' + formatMoney(price) + '</span>';
    }
  }

  document.querySelectorAll('.dame-product-card').forEach(function (card) {
    var swatches = card.querySelectorAll('.dame-color-swatch');
    if (!swatches.length) return;

    var productImg = card.querySelector('.dame-product-img');
    var productNameLink = card.querySelector('.dame-product-name a');
    var productImageLink = card.querySelector('.dame-product-image-link');
    var productButton = card.querySelector('.button');

    if (productNameLink && !productNameLink.dataset.originalHref) {
      productNameLink.dataset.originalHref = productNameLink.getAttribute('href');
    }
    if (productImageLink && !productImageLink.dataset.originalHref) {
      productImageLink.dataset.originalHref = productImageLink.getAttribute('href');
    }

    function updateProductUrl(url) {
      if (!url) return;
      if (productNameLink) productNameLink.setAttribute('href', url);
      if (productImageLink) productImageLink.setAttribute('href', url);
      if (productButton) productButton.onclick = function () { window.location.href = url; };
    }

    function restoreProductUrl() {
      if (productNameLink && productNameLink.dataset.originalHref) {
        productNameLink.setAttribute('href', productNameLink.dataset.originalHref);
      }
      if (productImageLink && productImageLink.dataset.originalHref) {
        productImageLink.setAttribute('href', productImageLink.dataset.originalHref);
      }
      if (productButton && card && card.dataset.productUrl) {
        var origUrl = card.dataset.productUrl;
        productButton.onclick = function () { window.location.href = origUrl; };
      }
    }

    // Initialize price from first active swatch (or first swatch with price data)
    var activeSwatch = card.querySelector('.dame-color-swatch--active') || card.querySelector('.dame-color-swatch[data-variant-price]');
    if (activeSwatch) {
      updatePrice(card, activeSwatch);
    }

    swatches.forEach(function (swatch) {
      swatch.addEventListener('mouseenter', function () {
        setImage(productImg, swatch.dataset.variantImage);
      });

      swatch.addEventListener('mouseleave', function () {
        var active = swatch.closest('.dame-color-swatches').querySelector('.dame-color-swatch--active');
        if (active) {
          setImage(productImg, active.dataset.variantImage);
        } else {
          restoreImage(productImg);
        }
      });

      swatch.addEventListener('click', function () {
        swatches.forEach(function (s) { s.classList.remove('dame-color-swatch--active'); });
        swatch.classList.add('dame-color-swatch--active');
        setImage(productImg, swatch.dataset.variantImage);
        if (swatch.dataset.variantUrl) {
          updateProductUrl(swatch.dataset.variantUrl);
        } else {
          restoreProductUrl();
        }
        if (card) { updatePrice(card, swatch); }
      });
    });
  });
});
