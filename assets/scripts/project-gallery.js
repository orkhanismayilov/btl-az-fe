`use strict`;

class ProjectGallery {
  /**
   * @type {HTMLElement}
   */
  galleryElem;
  /**
   * @type {HTMLElement}
   */
  thumbnailsElem;

  /**
   * @type {object}
   */
  gallery;
  /**
   * @type {object}
   */
  thumbnails;

  /**
   * @param {HTMLElement} galleryElem
   * @param {HTMLElement} thumbnailsElem
   */
  constructor(galleryElem, thumbnailsElem) {
    if (!galleryElem) {
      throw new Error('Gallery element is missing!');
    }

    if (!thumbnailsElem) {
      throw new Error('Thumbnails element is missing!');
    }

    this.galleryElem = galleryElem;
    this.thumbnailsElem = thumbnailsElem;
    this.init();
  }

  init() {
    if (typeof Fancybox !== 'undefined') {
      Fancybox.bind('[data-fancybox]', {
        on: {
          init: () => {
            this.gallery.autoplay.stop();
          },
          destroy: () => {
            this.gallery.autoplay.start();
          },
          'Carousel.selectSlide': (_, slide) => {
            this.gallery.slideTo(slide.page);
          },
        },
      });
    }

    this.observeThumbsHeight();

    this.thumbnails = new Swiper(this.thumbnailsElem, {
      direction: 'vertical',
      slidesPerView: 4,
      spaceBetween: 16,
      mousewheel: true,
    });

    this.gallery = new Swiper(this.galleryElem, {
      speed: 500,
      effect: 'fade',
      autoplay: {
        delay: 3000,
        pauseOnMouseEnter: true,
      },
      navigation: {
        enabled: true,
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
      thumbs: {
        swiper: this.thumbnails,
      },
    });
  }

  observeThumbsHeight() {
    const ro = new ResizeObserver(([entry]) => {
      this.thumbnailsElem.style.height = `${entry.contentRect.height}px`;
    });
    ro.observe(this.galleryElem);
  }
}
