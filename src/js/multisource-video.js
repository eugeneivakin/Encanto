class MultiSourceVideo extends HTMLElement {
  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.video = this.querySelector("video");
    this.mobileSrc = this.dataset.urlMobile;
    this.desktopSrc = this.dataset.urlDesktop;
    this.setSource();
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    this.setSource();
  }

  setSource() {
    if (!this.video) return;
    const isMobile = window.innerWidth < 750;
    const newSrc = isMobile ? this.mobileSrc : this.desktopSrc;
    if (this.video.src !== newSrc) {
      this.video.src = newSrc;
      this.video.load();
    }
  }
}

customElements.define("multisource-video", MultiSourceVideo);
