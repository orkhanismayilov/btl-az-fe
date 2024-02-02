`use strict`;

class Projects {
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
   * @param {HTMLButtonElement} loadMoreBtn
   */
  constructor(loadMoreBtn) {
    if (!loadMoreBtn) {
      throw new Error('Load more button is missing!');
    }

    this.loadMoreBtn = loadMoreBtn;
    this.wrapper = document.querySelector(this.loadMoreBtn.dataset.target);
    if (!this.wrapper) {
      throw new Error('Projects list wrapper is missing!');
    }

    this.url = this.loadMoreBtn.dataset.url?.trim();
    if (!this.url) {
      throw new Error('Load more URL is missing!');
    }

    this.init();
  }

  init() {
    this.loadMoreBtn.addEventListener('click', async e => {
      e.stopPropagation();
      await this.fetchData();
    });
  }

  async fetchData() {
    this.toggleButton(true);

    try {
      const response = await fetch(`${this.url}?page=${this.page + 1}`);

      if (!response.ok) {
        this.toggleButton(false);
        this.showError();
        return;
      }

      const body = await response.json();
      this.appenData(body.data);
      this.page++;

      if (!body.lastPage) {
        this.toggleButton(false);
        return;
      }

      this.loadMoreBtn.remove();
    } catch (err) {
      this.toggleButton(false);
      this.showError();
      console.error(err);
    }
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

  showError() {
    Toast.fire({
      iconHtml: '<i class="fa-regular fa-xmark text-danger"></i>',
      title: 'Oops... Failed to load more! Please, try again.',
    });
  }
}
