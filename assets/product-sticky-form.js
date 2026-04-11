customElements.define('sticky-product-form', class StickyProductForm extends HTMLElement {
  connectedCallback() {
    const sectionId = this.dataset.sectionId;

    this.mainProductForm = document.querySelector('product-form');
    this.mainVariantInput = this.mainProductForm?.querySelector('input.product-variant-id');
    this.mainSubmitButton = document.getElementById(`ProductSubmitButton-${sectionId}`);

    this.stickyVariantInput = this.querySelector('input.product-variant-id');
    this.stickySubmitButton = this.querySelector('.product-form__submit');

    this.onScrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollHandler, false);

    this.createObserver();
    this.watchMainVariant();

    this.stickySubmitButton?.addEventListener('click', (e) => {
      if (this.stickySubmitButton.disabled) {
        e.preventDefault();
        this.mainProductForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScrollHandler);
  }

  createObserver() {
    if (!this.mainProductForm) return;
    this.productFormBounds = false;
    new IntersectionObserver((entries) => {
      this.productFormBounds = entries[0].isIntersecting;
    }).observe(this.mainProductForm);
  }

  onScroll() {
    this.productFormBounds
      ? requestAnimationFrame(this.hide.bind(this))
      : requestAnimationFrame(this.reveal.bind(this));
  }

  hide() {
    if (this.classList.contains('product--sticky-form__active')) {
      this.classList.replace('product--sticky-form__active', 'product--sticky-form__inactive');
      document.body.classList.remove('has-sticky-atc');
    }
  }

  reveal() {
    if (this.classList.contains('product--sticky-form__inactive')) {
      this.classList.replace('product--sticky-form__inactive', 'product--sticky-form__active');
      document.body.classList.add('has-sticky-atc');
    }
  }

  syncButtonState() {
    if (!this.mainSubmitButton || !this.stickySubmitButton) return;
    this.stickySubmitButton.disabled = this.mainSubmitButton.disabled;
    const mainSpan = this.mainSubmitButton.querySelector('span:first-child');
    const stickySpan = this.stickySubmitButton.querySelector('span:first-child');
    if (mainSpan && stickySpan) stickySpan.textContent = mainSpan.textContent.trim();
  }

  watchMainVariant() {
    if (this.mainVariantInput) {
      new MutationObserver(() => {
        if (this.stickyVariantInput) {
          this.stickyVariantInput.value = this.mainVariantInput.value;
          this.stickyVariantInput.disabled = this.mainVariantInput.disabled;
        }
        this.syncButtonState();
      }).observe(this.mainVariantInput, { attributes: true, attributeFilter: ['value', 'disabled'] });
    }

    if (this.mainSubmitButton) {
      new MutationObserver(() => this.syncButtonState())
        .observe(this.mainSubmitButton, { attributes: true, attributeFilter: ['disabled'], childList: true, subtree: true });
    }
  }
});
