`use strict`;

const heroSwiper = document.querySelector('.hero-swiper');
if (heroSwiper) {
  new Swiper(heroSwiper, {
    loop: true,
    speed: 500,
    effect: 'fade',
    navigation: {
      enabled: true,
      nextEl: '.swiper-button-next',
    },
    pagination: {
      enabled: true,
      clickable: true,
      el: '.swiper-pagination',
    },
  });
}

const whySectionCounters = document.querySelectorAll('.why-section-counter-item span:first-child');
if (whySectionCounters.length) {
  const { default: counterUp } = window.counterUp;
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const whyCounter = entry.target;
      if (entry.isIntersecting) {
        counterUp(whyCounter, {
          duration: 1500,
          delay: 16,
        });

        io.unobserve(whyCounter);
      }
    }
  });

  for (const whyCounter of whySectionCounters) {
    io.observe(whyCounter);
  }
}

const contactForm = document.forms['contact-us-form'];
if (contactForm) {
  // TODO: Update url
  new ContactForm('/contact-us', contactForm);
}

const galleryWrapper = document.querySelector('.gallery-grid-wrapper');
if (galleryWrapper) {
  // TODO: Update url
  new Gallery('/gallery', galleryWrapper);
}

const projectGallery = document.querySelector('.project-gallery-swiper');
const projectGalleryThumbs = document.querySelector('.project-gallery-thumbs');
if (projectGallery && projectGalleryThumbs) {
  new ProjectGallery(projectGallery, projectGalleryThumbs);
}
