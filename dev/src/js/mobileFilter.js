import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { reCalculateDropdownHeight } from './dropdown';

document.addEventListener('DOMContentLoaded', () => {
    initMobileFilter();
});

const initMobileFilter = () => {
    const showBtn = document.querySelector('.show-filter');
    const aside = document.querySelector('.category-aside');
    const closeBtn = document.querySelector('.close-filter');

    if (!showBtn || !aside) return;

    const openFilter = () => {
        aside.classList.add('opened');
        disableBodyScroll(aside);

        const dropdowns = aside.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.add('opened');
            requestAnimationFrame(() => {
                reCalculateDropdownHeight(dropdown);
            });
        });
    };

    const closeFilter = () => {
        aside.classList.remove('opened');
        enableBodyScroll(aside);
    };

    showBtn.addEventListener('click', openFilter);

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilter);
    }

    aside.addEventListener('click', (e) => {
        if (e.target === aside) {
            closeFilter();
        }
    });
};

