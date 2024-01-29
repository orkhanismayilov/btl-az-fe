`use strict`;

class Gallery {
  page = 1;

  /**
   * @type {string}
   */
  url;
  /**
   * @type {HTMLElement}
   */
  wrapper;
  /**
   * @type {HTMLButtonElement}
   */
  loadMoreBtn;
  /**
   * @type {HTMLElement}
   */
  loadMoreBtnIcon;

  /**
   * @param {string} url
   * @param {HTMLElement} wrapper
   */
  constructor(url, wrapper) {
    if (!wrapper) {
      throw new Error('Gallery wrapper is missing!');
    }

    if (!url.trim()) {
      throw new Error('URL is missing!');
    }

    this.url = url.trim();
    this.wrapper = wrapper;
    this.init();
  }

  init() {
    this.loadMoreBtn = document.querySelector('[data-gallery-load-more]');
    this.loadMoreBtnIcon = document.querySelector('i');

    this.loadMoreBtn?.addEventListener('click', async e => {
      e.stopPropagation();
      await this.fetchData();
    });

    if (typeof Fancybox !== 'undefined') {
      Fancybox.bind('[data-fancybox]');
    }
  }

  async fetchData() {
    this.toggleButton(true);

    const response = await fetch(`${this.url}?page=${this.page}`);

    if (!response.ok) {
      this.toggleButton(false);
      return;
    }

    const body = await response.json();
    this.appenData(body.data);

    if (!body.lastPage) {
      this.toggleButton(false);
      return;
    }

    this.loadMoreBtn.remove();
  }

  /**
   * @param {string} data
   */
  appenData(data) {
    const parser = new DOMParser();
    const nodes = parser.parseFromString(data, 'text/html').body.childNodes;
    this.wrapper.append(...nodes);
  }

  /**
   * @param {boolean} disabled
   */
  toggleButton(disabled) {
    this.loadMoreBtn.disabled = disabled;
    if (disabled) {
      this.loadMoreBtnIcon?.classList.add('fa-fade');
    } else {
      this.loadMoreBtnIcon?.classList.remove('fa-fade');
    }
  }
}
