import './modal';
import { initTabsSliders } from '../tabsSlider.js';
import { initProductCards } from './productCard.js';
import { initGiftModal } from '../giftModal.js';
import { Fancybox } from '@fancyapps/ui/dist/fancybox/';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

document.addEventListener("DOMContentLoaded", () => {
	"use strict";
	initBurgerMenu();
	initLanguageSwitcher();
	initTabsSliders();
	initProductCards();
	initPromoCopy();
	initGiftModal();
});

const initBurgerMenu = () => {
	const header = document.querySelector('.header');
	const burger = header ? header.querySelector('.header-burger') : null;
	const nav = header ? header.querySelector('.header-nav') : null;
	const headerInner = header ? header.querySelector('.header-inner') : null;
	const search = header ? header.querySelector('.header-search') : null;

	if (!header || !burger || !nav || !headerInner || !search) return;

	const moveSearchToMenu = () => {
		if (!nav.contains(search)) {
			nav.prepend(search);
		}
	};

	const moveSearchToHeader = () => {
		if (!headerInner.contains(search)) {
			headerInner.insertBefore(search, headerInner.firstChild);
		}
	};

	const closeMenu = () => {
		header.classList.remove('menu-open');
		burger.setAttribute('aria-expanded', 'false');
		moveSearchToHeader();
		enableBodyScroll(nav);
	};

	const openMenu = () => {
		header.classList.add('menu-open');
		burger.setAttribute('aria-expanded', 'true');
		moveSearchToMenu();
		disableBodyScroll(nav);
	};

	const toggleMenu = () => {
		header.classList.contains('menu-open') ? closeMenu() : openMenu();
	};

	burger.addEventListener('click', toggleMenu);

	nav.addEventListener('click', (event) => {
		const target = event.target;

		if (!target || !(target instanceof Element)) {
			return;
		}

		if (target.closest('a')) {
			const link = target.closest('a');
			const parentItem = link.closest('.menu-item-has-children');

			if (parentItem && window.innerWidth < 992) {
				event.preventDefault();
				const isCurrentlyOpen = parentItem.classList.contains('sub-open');

				parentItem.closest('.menu').querySelectorAll('.menu-item-has-children.sub-open').forEach(openItem => {
					if (openItem !== parentItem) {
						openItem.classList.remove('sub-open');
						const subMenu = openItem.querySelector('.sub-menu');
						if (subMenu) {
							subMenu.style.height = '0';
						}
					}
				});

				if (isCurrentlyOpen) {
					parentItem.classList.remove('sub-open');
					const subMenu = parentItem.querySelector('.sub-menu');
					if (subMenu) {
						subMenu.style.height = '0';
					}
				} else {
					parentItem.classList.add('sub-open');
					const subMenu = parentItem.querySelector('.sub-menu');
					if (subMenu) {
						const menuItems = subMenu.querySelectorAll('.menu-item');
						let totalHeight = 0;
						menuItems.forEach(item => {
							totalHeight += item.offsetHeight;
						});
						const gap = 4;
						const totalGap = gap * (menuItems.length - 1);
						subMenu.style.height = `${totalHeight + totalGap}px`;
					}
				}
			} else {
				closeMenu();
			}
		}
	});

	const mediaQuery = window.matchMedia('(min-width: 992px)');

	const handleMediaChange = (event) => {
		if (!header.classList.contains('menu-open')) return;

		if (event.matches) {
			closeMenu();
			document.querySelectorAll('.menu-item-has-children.sub-open').forEach(item => {
				item.classList.remove('sub-open');
			});
			document.querySelectorAll('.menu-item-has-children .sub-menu').forEach(subMenu => {
				subMenu.style.height = '';
			});
			clearAllBodyScrollLocks();
		}
	};

	mediaQuery.addEventListener('change', handleMediaChange);
}

const initLanguageSwitcher = () => {
	const langButton = document.getElementById('lang');
	const body = document.body;

	if (!langButton || !body) return;

	const currentLang = localStorage.getItem('selectedLanguage') || 'ru';
	body.setAttribute('data-lang', currentLang);

	const updateLangButton = (lang) => {
		const span = langButton.querySelector('span');
		if (span) {
			span.textContent = lang === 'ru' ? 'EN' : 'RU';
		}
	};

	updateLangButton(currentLang);

	langButton.addEventListener('click', () => {
		const currentLang = body.getAttribute('data-lang');
		const newLang = currentLang === 'ru' ? 'en' : 'ru';

		body.setAttribute('data-lang', newLang);
		localStorage.setItem('selectedLanguage', newLang);
		updateLangButton(newLang);
	});
}

const initPromoCopy = () => {
	const promoButtons = document.querySelectorAll('[data-promo]');

	promoButtons.forEach(button => {
		button.addEventListener('click', () => {
			const promoCode = button.getAttribute('data-promo');
			if (promoCode) {
				navigator.clipboard.writeText(promoCode).then(() => {
					const originalContent = button.innerHTML;
					const span = button.querySelector('span');

					if (span) {
						const originalSpanContent = span.innerHTML;
						span.textContent = 'СКОПИРОВАНО!';
						button.classList.add('copied');

						setTimeout(() => {
							span.innerHTML = originalSpanContent;
							button.classList.remove('copied');
						}, 2000);
					}
				}).catch(err => {
					console.error('Failed to copy: ', err);
				});
			}
		});
	});
}

Fancybox.bind('[data-fancybox]', {});