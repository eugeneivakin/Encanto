
(function() {
  // Получаем строку перевода из Liquid (должно быть внедрено через data-атрибут или глобальную переменную)
  var promoTemplate = window.promoBadgeTemplate || '';
  var promoCode = sessionStorage.getItem('promo_code');
  var isOnTargetCollection = window.location.pathname.startsWith('/collections/ctr-beauty-boxes');
  if (promoCode && promoTemplate && isOnTargetCollection) {
    var promoText = promoTemplate.replace(/\{\{\s*code\s*\}\}/g, promoCode);
    var grid = document.getElementById('product-grid');
    if (grid) {
      var wrappers = grid.querySelectorAll('.dame-product-image-wrapper');
      wrappers.forEach(function(wrapper) {
        // Не дублируем бейдж, если он уже есть
        if (!wrapper.querySelector('.dame-discount-badge-overlay')) {
          var badge = document.createElement('span');
          badge.className = 'dame-discount-badge-overlay';
          badge.textContent = promoText;
          badge.style.setProperty('display', 'block', 'important');
          wrapper.appendChild(badge);
        }
      });
    }
  }
})();