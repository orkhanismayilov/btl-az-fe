`use strict`;

const heroSwiper = document.querySelector('.hero-swiper');
if (heroSwiper) {
  new Swiper(heroSwiper, {
    loop: true,
    speed: 500,
    navigation: {
      enabled: true,
      nextEl: '.swiper-button-next',
    },
  });
}
