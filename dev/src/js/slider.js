import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    initCardSliders('.swiper-cards');
});

const initCardSliders = (selector) => {
    const swipers = document.querySelectorAll(selector);

    swipers.forEach(swiper => {
        const container = swiper.parentElement;

        new Swiper(swiper, {
            modules: [Navigation],
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                prevEl: container.querySelector('.swiper-prev'),
                nextEl: container.querySelector('.swiper-next'),
            },
            breakpoints: {
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1200: { slidesPerView: 4, spaceBetween: 35 },
            },
        });
    });
};
