`use strict`;

// Toast Notifications
if (typeof Swal !== 'undefined') {
  window.Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    padding: '.25rem .75rem',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      icon: 'swal-toast-icon',
    },
    didOpen: toast => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
      toast.onclick = Swal.close;
    },
  });
}

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

const loadMoreProjectsBtn = document.querySelector('[data-projects-load-more]');
if (loadMoreProjectsBtn) {
  new Projects(loadMoreProjectsBtn);
}

const playBtns = document.querySelectorAll('.btn-play');
if (playBtns.length && typeof Swal !== 'undefined') {
  for (const btn of playBtns) {
    btn.addEventListener('click', e => {
      e.stopPropagation();

      let { videoUrl } = btn.dataset;
      if (!videoUrl || !videoUrl.includes('watch?v=')) {
        throw new Error('Video URL is missing or invalid');
      }

      videoUrl = videoUrl.replace('watch?v=', 'embed/');
      Swal.fire({
        html: `<iframe width="100%" src="${videoUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
        showConfirmButton: false,
        showCloseButton: true,
        width: '80%',
        padding: 0,
        customClass: {
          popup: 'swal-video-popup',
          htmlContainer: 'swal-video-container',
        },
      });
    });
  }
}
